package cm.keycebet.wallet.service;

import cm.keycebet.common.enums.TransactionStatus;
import cm.keycebet.common.enums.TransactionType;
import cm.keycebet.common.exception.InsufficientBalanceException;
import cm.keycebet.common.exception.ResourceNotFoundException;
import cm.keycebet.user.entity.User;
import cm.keycebet.user.repository.UserRepository;
import cm.keycebet.wallet.dto.*;
import cm.keycebet.wallet.entity.Transaction;
import cm.keycebet.wallet.payment.MonetBilClient;
import cm.keycebet.wallet.payment.MonetBilException;
import cm.keycebet.wallet.payment.MonetBilPaymentResponse;
import cm.keycebet.wallet.payment.MonetBilProperties;
import cm.keycebet.wallet.payment.MonetBilWebhookPayload;
import cm.keycebet.wallet.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletService {

    private final UserRepository        userRepository;
    private final TransactionRepository transactionRepository;
    private final MonetBilClient        monetBilClient;
    private final MonetBilProperties    monetBilProps;

    // ─── Balance ──────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public WalletDto getBalance() {
        User user = getCurrentUser();
        return WalletDto.builder()
                .userId(user.getId())
                .balance(user.getBalance())
                .currency("XAF")
                .build();
    }

    // ─── Transactions ─────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<TransactionDto> getMyTransactions(Pageable pageable) {
        User user = getCurrentUser();
        return transactionRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(this::toDto);
    }

    // ─── Dépôt via MonetBil ───────────────────────────────────────────────────

    /**
     * Initie un dépôt via MonetBil.
     *
     * Flux :
     * 1. Génère une référence interne unique
     * 2. Appelle MonetBil placePayment (MTN ou Orange Money)
     * 3. Persiste la transaction en PENDING avec le paymentId MonetBil
     * 4. Le webhook /wallet/webhook/monetbil finalisera la transaction
     */
    @Transactional
    public TransactionDto deposit(DepositRequest request) {
        User user = getCurrentUser();
        String reference = "DEP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        log.info("[Deposit] Initiation — user={} amount={} provider={} ref={}",
                user.getEmail(), request.getAmount(), request.getProvider(), reference);

        // Convertir le provider interne en opérateur MonetBil
        String monetBilOperator = MonetBilClient.toMonetBilOperator(request.getProvider());

        // Construire la transaction PENDING avant l'appel API
        Transaction tx = Transaction.builder()
                .user(user)
                .type(TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .status(TransactionStatus.PENDING)
                .provider(request.getProvider().toUpperCase())
                .reference(reference)
                .build();

        try {
            // Appel MonetBil
            MonetBilPaymentResponse monetBilResponse = monetBilClient.initiatePayment(
                    request.getAmount(),
                    request.getPhoneNumber(),
                    monetBilOperator,
                    reference,
                    monetBilProps.getNotifyUrl()
            );

            // Stocker le paymentId MonetBil dans la transaction
            tx.setPaymentId(monetBilResponse.getPaymentId());

            // Stocker les données brutes en metadata
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("monetbilPaymentId", monetBilResponse.getPaymentId());
            metadata.put("operator", monetBilOperator);
            metadata.put("phone", request.getPhoneNumber());
            tx.setMetadata(metadata);

            log.info("[Deposit] MonetBil accepté — ref={} paymentId={}",
                    reference, monetBilResponse.getPaymentId());

        } catch (MonetBilException e) {
            // Erreur technique MonetBil → marquer FAILED immédiatement
            log.error("[Deposit] Erreur MonetBil pour ref={} : {}", reference, e.getMessage());
            tx.setStatus(TransactionStatus.FAILED);
            Map<String, Object> errMeta = new HashMap<>();
            errMeta.put("error", e.getMessage());
            tx.setMetadata(errMeta);
        }

        Transaction saved = transactionRepository.save(tx);
        return toDto(saved);
    }

    // ─── Retrait via MonetBil ─────────────────────────────────────────────────

    /**
     * Initie un retrait via MonetBil (paiement sortant vers le téléphone de l'utilisateur).
     *
     * Flux :
     * 1. Vérifie le solde disponible
     * 2. Déduit le solde immédiatement (montant réservé)
     * 3. Appelle MonetBil placePayment
     * 4. Persiste la transaction PENDING
     * 5. Le webhook confirme (COMPLETED) ou rembourse (FAILED)
     */
    @Transactional
    public TransactionDto withdraw(WithdrawRequest request) {
        User user = getCurrentUser();

        if (user.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException(
                    "Solde insuffisant. Solde actuel : " + user.getBalance() + " XAF");
        }

        String reference = "WIT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String monetBilOperator = MonetBilClient.toMonetBilOperator(request.getProvider());

        log.info("[Withdraw] Initiation — user={} amount={} provider={} ref={}",
                user.getEmail(), request.getAmount(), request.getProvider(), reference);

        // Déduire le solde de façon préventive (si échec MonetBil → remboursement)
        user.setBalance(user.getBalance().subtract(request.getAmount()));
        userRepository.save(user);

        Transaction tx = Transaction.builder()
                .user(user)
                .type(TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .status(TransactionStatus.PENDING)
                .provider(request.getProvider().toUpperCase())
                .reference(reference)
                .build();

        try {
            MonetBilPaymentResponse monetBilResponse = monetBilClient.initiatePayment(
                    request.getAmount(),
                    request.getPhoneNumber(),
                    monetBilOperator,
                    reference,
                    monetBilProps.getNotifyUrl()
            );

            tx.setPaymentId(monetBilResponse.getPaymentId());

            Map<String, Object> metadata = new HashMap<>();
            metadata.put("monetbilPaymentId", monetBilResponse.getPaymentId());
            metadata.put("operator", monetBilOperator);
            metadata.put("phone", request.getPhoneNumber());
            tx.setMetadata(metadata);

            log.info("[Withdraw] MonetBil accepté — ref={} paymentId={}",
                    reference, monetBilResponse.getPaymentId());

        } catch (MonetBilException e) {
            // Erreur MonetBil → rembourser le solde déduit
            log.error("[Withdraw] Erreur MonetBil pour ref={} : {} — remboursement solde", reference, e.getMessage());
            user.setBalance(user.getBalance().add(request.getAmount()));
            userRepository.save(user);
            tx.setStatus(TransactionStatus.FAILED);
            Map<String, Object> errMeta = new HashMap<>();
            errMeta.put("error", e.getMessage());
            tx.setMetadata(errMeta);
        }

        Transaction saved = transactionRepository.save(tx);
        return toDto(saved);
    }

    // ─── Traitement du webhook MonetBil ──────────────────────────────────────

    /**
     * Appelé par PaymentWebhookController quand MonetBil notifie notre serveur.
     * Met à jour le statut de la transaction et ajuste le solde utilisateur.
     */
    @Transactional
    public void processWebhookNotification(MonetBilWebhookPayload payload) {
        log.info("[Webhook] Notification MonetBil reçue — ref={} status={} paymentId={}",
                payload.getPayment_ref(), payload.getStatus(), payload.getPaymentId());

        // Retrouver la transaction par référence interne
        Transaction tx = transactionRepository
                .findByReference(payload.getPayment_ref())
                .or(() -> transactionRepository.findByPaymentId(payload.getPaymentId()))
                .orElse(null);

        if (tx == null) {
            log.warn("[Webhook] Transaction introuvable pour ref={} / paymentId={}",
                    payload.getPayment_ref(), payload.getPaymentId());
            return;
        }

        // Ignorer si déjà finalisée (idempotence)
        if (tx.getStatus() == TransactionStatus.COMPLETED
                || tx.getStatus() == TransactionStatus.FAILED) {
            log.info("[Webhook] Transaction {} déjà finalisée ({}), webhook ignoré",
                    tx.getReference(), tx.getStatus());
            return;
        }

        // Enrichir les metadata avec les données du webhook
        Map<String, Object> meta = tx.getMetadata() != null
                ? new HashMap<>(tx.getMetadata())
                : new HashMap<>();
        meta.put("webhookStatus", payload.getStatus());
        meta.put("transactionId", payload.getTransaction_id());
        meta.put("transactionUuid", payload.getTransaction_uuid());
        tx.setMetadata(meta);

        String status = payload.getStatus();

        if ("1".equals(status) || "success".equalsIgnoreCase(status)) {
            // ── SUCCÈS ──
            tx.setStatus(TransactionStatus.COMPLETED);

            if (tx.getType() == TransactionType.DEPOSIT) {
                // Créditer le solde pour un dépôt confirmé
                User user = userRepository.findById(tx.getUser().getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", tx.getUser().getId()));
                user.setBalance(user.getBalance().add(tx.getAmount()));
                userRepository.save(user);
                log.info("[Webhook] DÉPÔT COMPLÉTÉ — user={} +{}XAF solde={}",
                        user.getEmail(), tx.getAmount(), user.getBalance());
            } else if (tx.getType() == TransactionType.WITHDRAWAL) {
                // Retrait : le solde a déjà été déduit lors de l'initiation
                log.info("[Webhook] RETRAIT COMPLÉTÉ — ref={} {}XAF",
                        tx.getReference(), tx.getAmount());
            }

        } else if ("-1".equals(status) || "cancelled".equalsIgnoreCase(status)) {
            // ── ANNULÉ ──
            tx.setStatus(TransactionStatus.CANCELLED);
            if (tx.getType() == TransactionType.WITHDRAWAL) {
                refundWithdrawal(tx);
            }
            log.info("[Webhook] Transaction ANNULÉE — ref={}", tx.getReference());

        } else {
            // ── ÉCHEC (0 ou autre) ──
            tx.setStatus(TransactionStatus.FAILED);
            if (tx.getType() == TransactionType.WITHDRAWAL) {
                refundWithdrawal(tx);
            }
            log.warn("[Webhook] Transaction ÉCHOUÉE — ref={} status={}", tx.getReference(), status);
        }

        transactionRepository.save(tx);
    }

    /**
     * Rembourse le solde lors d'un retrait échoué/annulé
     * (le montant avait été déduit de façon préventive).
     */
    private void refundWithdrawal(Transaction tx) {
        User user = userRepository.findById(tx.getUser().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", tx.getUser().getId()));
        user.setBalance(user.getBalance().add(tx.getAmount()));
        userRepository.save(user);
        log.info("[Webhook] Remboursement retrait — user={} +{}XAF", user.getEmail(), tx.getAmount());
    }

    // ─── Polling Manuel (check-payment) ──────────────────────────────────────

    /**
     * Vérifie le statut d'un paiement en interrogeant directement MonetBil.
     * Utilisé par le frontend en mode polling (quand le webhook n'est pas disponible en dev).
     */
    @Transactional
    public TransactionDto checkPaymentStatus(String reference) {
        Transaction tx = transactionRepository
                .findByReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction", reference));

        // Si déjà finalisée, retourner directement
        if (tx.getStatus() != TransactionStatus.PENDING || tx.getPaymentId() == null) {
            return toDto(tx);
        }

        // Interroger MonetBil
        try {
            Map<String, Object> monetBilStatus = monetBilClient.checkPayment(tx.getPaymentId());
            log.info("[CheckPayment] Statut MonetBil pour ref={} : {}", reference, monetBilStatus);
            
            if (monetBilStatus != null) {
                // Si la transaction est finalisée avec succès ou échec
                Map<String, Object> transactionData = (Map<String, Object>) monetBilStatus.get("transaction");
                if (transactionData != null && transactionData.containsKey("status")) {
                    Object statusObj = transactionData.get("status");
                    String status = statusObj != null ? statusObj.toString() : "0";
                    
                    // Construire un payload simulé pour processWebhookNotification
                    MonetBilWebhookPayload payload = new MonetBilWebhookPayload();
                    payload.setPayment_ref(reference);
                    payload.setPaymentId(tx.getPaymentId());
                    payload.setStatus(status);
                    
                    if (transactionData.get("transaction_UUID") != null) {
                        payload.setTransaction_uuid(transactionData.get("transaction_UUID").toString());
                    }
                    if (transactionData.get("transaction_id") != null) {
                        payload.setTransaction_id(transactionData.get("transaction_id").toString());
                    }
                    
                    // Traiter la mise à jour (solde + transaction) en réutilisant la logique du webhook
                    processWebhookNotification(payload);
                    
                    // Recharger la transaction
                    tx = transactionRepository.findById(tx.getId()).orElse(tx);
                }
            }
        } catch (Exception e) {
            log.warn("[CheckPayment] Impossible de vérifier auprès de MonetBil: {}", e.getMessage());
        }

        return toDto(tx);
    }

    // ─── Méthodes internes (appelées par BetService) ──────────────────────────

    @Transactional
    public void deductForBet(User user, BigDecimal amount) {
        if (user.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(
                    "Solde insuffisant. Solde actuel : " + user.getBalance() + " XAF");
        }
        user.setBalance(user.getBalance().subtract(amount));
        userRepository.save(user);

        transactionRepository.save(Transaction.builder()
                .user(user)
                .type(TransactionType.BET_STAKE)
                .amount(amount)
                .status(TransactionStatus.COMPLETED)
                .build());
    }

    @Transactional
    public void creditWin(User user, BigDecimal amount) {
        User freshUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", user.getId()));
        freshUser.setBalance(freshUser.getBalance().add(amount));
        userRepository.save(freshUser);

        transactionRepository.save(Transaction.builder()
                .user(freshUser)
                .type(TransactionType.BET_WIN)
                .amount(amount)
                .status(TransactionStatus.COMPLETED)
                .build());

        log.info("Gain crédité — user={} amount={}", freshUser.getEmail(), amount);
    }

    // ─── Admin ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<TransactionDto> getAllTransactions(Pageable pageable) {
        return transactionRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::toDto);
    }

    // ─── Utilitaires ─────────────────────────────────────────────────────────

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", email));
    }

    private TransactionDto toDto(Transaction tx) {
        return TransactionDto.builder()
                .id(tx.getId())
                .type(tx.getType())
                .amount(tx.getAmount())
                .status(tx.getStatus())
                .reference(tx.getReference())
                .provider(tx.getProvider())
                .paymentId(tx.getPaymentId())
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
