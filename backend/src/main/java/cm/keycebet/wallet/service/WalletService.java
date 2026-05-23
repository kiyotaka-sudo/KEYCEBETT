package cm.keycebet.wallet.service;

import cm.keycebet.common.enums.TransactionStatus;
import cm.keycebet.common.enums.TransactionType;
import cm.keycebet.common.exception.InsufficientBalanceException;
import cm.keycebet.common.exception.ResourceNotFoundException;
import cm.keycebet.user.entity.User;
import cm.keycebet.user.repository.UserRepository;
import cm.keycebet.wallet.dto.*;
import cm.keycebet.wallet.entity.Transaction;
import cm.keycebet.wallet.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletService {

    private final UserRepository        userRepository;
    private final TransactionRepository transactionRepository;

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

    // ─── Dépôt ────────────────────────────────────────────────────────────────

    /**
     * TODO - AMI 1 : Intégrer l'API de paiement ici
     * Providers cibles : MTN Mobile Money, Orange Money Cameroun
     * Variable d'env : PAYMENT_API_KEY, PAYMENT_API_URL
     * Cette méthode doit appeler le provider, créer la transaction
     * et mettre à jour le statut via webhook ou polling.
     *
     * Flux attendu :
     * 1. Appeler l'API du provider avec amount + phoneNumber
     * 2. Récupérer un reference/transactionId du provider
     * 3. Persister la transaction en PENDING
     * 4. Mettre à jour en COMPLETED via webhook (endpoint à créer)
     * 5. Créditer le solde de l'utilisateur
     */
    @Transactional
    public TransactionDto deposit(DepositRequest request) {
        User user = getCurrentUser();
        log.info("[STUB] Dépôt demandé — user={} amount={} provider={}",
                user.getEmail(), request.getAmount(), request.getProvider());

        Transaction tx = Transaction.builder()
                .user(user)
                .type(TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .status(TransactionStatus.PENDING)
                .provider(request.getProvider())
                .reference("DEP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();

        Transaction saved = transactionRepository.save(tx);
        log.info("[STUB] Transaction créée en PENDING — ref={}", saved.getReference());
        return toDto(saved);
    }

    // ─── Retrait ──────────────────────────────────────────────────────────────

    /**
     * TODO - AMI 1 : Intégrer l'API de paiement ici
     * Providers cibles : MTN Mobile Money, Orange Money Cameroun
     * Variable d'env : PAYMENT_API_KEY, PAYMENT_API_URL
     * Cette méthode doit appeler le provider, créer la transaction
     * et mettre à jour le statut via webhook ou polling.
     *
     * Flux attendu :
     * 1. Vérifier le solde de l'utilisateur
     * 2. Appeler l'API du provider pour initier le retrait
     * 3. Déduire le solde immédiatement (ou à confirmation)
     * 4. Persister la transaction en PENDING
     * 5. Mettre à jour en COMPLETED/FAILED via webhook
     */
    @Transactional
    public TransactionDto withdraw(WithdrawRequest request) {
        User user = getCurrentUser();

        if (user.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientBalanceException();
        }

        log.info("[STUB] Retrait demandé — user={} amount={} provider={}",
                user.getEmail(), request.getAmount(), request.getProvider());

        Transaction tx = Transaction.builder()
                .user(user)
                .type(TransactionType.WITHDRAWAL)
                .amount(request.getAmount())
                .status(TransactionStatus.PENDING)
                .provider(request.getProvider())
                .reference("WIT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .build();

        Transaction saved = transactionRepository.save(tx);
        log.info("[STUB] Retrait créé en PENDING — ref={}", saved.getReference());
        return toDto(saved);
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
        // Recharger l'utilisateur pour éviter les données périmées
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
                .createdAt(tx.getCreatedAt())
                .build();
    }
}
