package cm.keycebet.wallet.payment;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Client HTTP dédié aux appels vers l'API MonetBil v1.
 * Utilise Spring RestClient (Spring 6.1+, inclus dans spring-boot-starter-web).
 *
 * Opérateurs Cameroun :
 *   MTN Mobile Money  → CM_MTNMOBILEMONEY
 *   Orange Money      → CM_ORANGEMONEY
 *   Express Union     → CM_EUMM
 */
@Slf4j
@Service
public class MonetBilClient {

    private static final String PLACE_PAYMENT = "/placePayment";
    private static final String CHECK_PAYMENT = "/checkPayment";

    private final RestClient        restClient;
    private final MonetBilProperties props;

    public MonetBilClient(MonetBilProperties props) {
        this.props = props;
        this.restClient = RestClient.builder()
                .baseUrl(props.getApiUrl())
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("Accept",       MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    // ─── Initier un paiement ──────────────────────────────────────────────────

    /**
     * Appelle MonetBil placePayment pour initier un paiement (dépôt ou retrait).
     *
     * @param amount     Montant en XAF
     * @param phone      Numéro au format +237XXXXXXXXX
     * @param operator   CM_MTNMOBILEMONEY ou CM_ORANGEMONEY
     * @param paymentRef Notre référence interne (ex: "DEP-A1B2C3D4")
     * @param notifyUrl  URL de notre webhook
     * @return Réponse MonetBil (paymentId, success, ...)
     */
    public MonetBilPaymentResponse initiatePayment(
            BigDecimal amount,
            String phone,
            String operator,
            String paymentRef,
            String notifyUrl) {

        // MonetBil attend le numéro sans "+", au format 237XXXXXXXXX
        String normalizedPhone = phone.startsWith("+") ? phone.substring(1) : phone;

        Map<String, Object> body = new HashMap<>();
        body.put("service",     props.getServiceKey());
        body.put("phonenumber", normalizedPhone);
        body.put("amount",      amount.intValue());  // MonetBil attend un entier
        body.put("operator",    operator);
        body.put("currency",    "XAF");
        body.put("country",     "CM");
        body.put("payment_ref", paymentRef);
        body.put("notify_url",  notifyUrl);

        log.info("[MonetBil] → placePayment ref={} phone={} operator={} amount={}",
                paymentRef, normalizedPhone, operator, amount);

        try {
            MonetBilPaymentResponse response = restClient.post()
                    .uri(PLACE_PAYMENT)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(MonetBilPaymentResponse.class);

            log.info("[MonetBil] ← placePayment response: {}", response);
            return response;

        } catch (RestClientException e) {
            log.error("[MonetBil] Erreur HTTP placePayment: {}", e.getMessage());
            throw new MonetBilException("Erreur API MonetBil: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("[MonetBil] Erreur inattendue placePayment: {}", e.getMessage());
            throw new MonetBilException("Impossible de contacter MonetBil: " + e.getMessage(), e);
        }
    }

    // ─── Vérifier le statut d'un paiement ────────────────────────────────────

    /**
     * Appelle MonetBil checkPayment pour vérifier le statut d'un paiement.
     *
     * @param paymentId L'ID retourné par placePayment
     * @return Map contenant les détails du statut
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> checkPayment(String paymentId) {
        Map<String, Object> body = new HashMap<>();
        body.put("paymentId", paymentId);

        log.info("[MonetBil] → checkPayment paymentId={}", paymentId);

        try {
            Map<String, Object> response = restClient.post()
                    .uri(CHECK_PAYMENT)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            log.info("[MonetBil] ← checkPayment: {}", response);
            return response != null ? response : Map.of();

        } catch (RestClientException e) {
            log.error("[MonetBil] Erreur checkPayment: {}", e.getMessage());
            throw new MonetBilException("Erreur checkPayment MonetBil: " + e.getMessage(), e);
        } catch (Exception e) {
            log.error("[MonetBil] Erreur inattendue checkPayment: {}", e.getMessage());
            throw new MonetBilException("Impossible de vérifier le paiement: " + e.getMessage(), e);
        }
    }

    // ─── Utilitaires ─────────────────────────────────────────────────────────

    /**
     * Convertit le code opérateur interne en code MonetBil Cameroun.
     * MTN_MOMO | MTN → CM_MTNMOBILEMONEY
     * ORANGE_MONEY | ORANGE → CM_ORANGEMONEY
     */
    public static String toMonetBilOperator(String provider) {
        return switch (provider.toUpperCase()) {
            case "MTN_MOMO", "MTN" -> "CM_MTNMOBILEMONEY";
            case "ORANGE_MONEY", "ORANGE" -> "CM_ORANGEMONEY";
            default -> throw new IllegalArgumentException("Provider de paiement inconnu: " + provider);
        };
    }
}
