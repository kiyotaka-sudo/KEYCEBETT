package cm.keycebet.wallet.controller;

import cm.keycebet.common.response.ApiResponse;
import cm.keycebet.wallet.payment.MonetBilWebhookPayload;
import cm.keycebet.wallet.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

/**
 * Endpoint public recevant les notifications de paiement de MonetBil.
 *
 * ⚠️ Cette route DOIT être exclue de l'authentification JWT dans SecurityConfig.
 *    MonetBil appelle ce webhook sans token.
 *
 * URL configurée dans application.yml → monetbil.notify-url
 */
@Slf4j
@RestController
@RequestMapping("/wallet/webhook")
@RequiredArgsConstructor
@Tag(name = "Webhook Paiement", description = "Notifications de paiement MonetBil (MTN / Orange Money)")
public class PaymentWebhookController {

    private final WalletService walletService;

    /**
     * Endpoint appelé par MonetBil après chaque changement de statut de paiement.
     *
     * MonetBil peut envoyer les paramètres en JSON ou en form-data selon la config.
     * On accepte les deux formats.
     */
    // MonetBil supporte GET et POST selon la configuration du service
    @RequestMapping(value = "/monetbil", method = {RequestMethod.GET, RequestMethod.POST})
    @Operation(
        summary = "Webhook MonetBil",
        description = "Reçoit les notifications de paiement de MonetBil (GET ou POST). Accès public (pas de JWT requis)."
    )
    public ResponseEntity<ApiResponse<String>> handleMonetBilWebhook(
            @RequestBody(required = false) MonetBilWebhookPayload jsonPayload,
            @RequestParam(required = false) Map<String, String> formParams) {

        // Construire le payload selon le format reçu
        MonetBilWebhookPayload payload = jsonPayload;

        if (payload == null && formParams != null && !formParams.isEmpty()) {
            // MonetBil a envoyé en form-data (application/x-www-form-urlencoded)
            payload = new MonetBilWebhookPayload();
            payload.setStatus(formParams.get("status"));
            payload.setPayment_ref(formParams.get("payment_ref"));
            payload.setTransaction_id(formParams.get("transaction_id"));
            payload.setTransaction_uuid(formParams.get("transaction_uuid"));
            payload.setAmount(formParams.get("amount"));
            payload.setCurrency(formParams.get("currency"));
            payload.setPhone(formParams.get("phone"));
            payload.setOperator(formParams.get("operator"));
            payload.setCountry(formParams.get("country"));
            payload.setPaymentId(formParams.get("paymentId"));
        }

        if (payload == null) {
            log.warn("[Webhook] Requête MonetBil vide reçue");
            return ResponseEntity.ok(ApiResponse.success("OK"));
        }

        log.info("[Webhook] MonetBil → ref={} status={} operator={} amount={}",
                payload.getPayment_ref(), payload.getStatus(),
                payload.getOperator(), payload.getAmount());

        try {
            walletService.processWebhookNotification(payload);
        } catch (Exception e) {
            // MonetBil attend toujours un 200 OK — on log l'erreur sans propager
            log.error("[Webhook] Erreur lors du traitement de la notification MonetBil: {}", e.getMessage(), e);
        }

        // MonetBil requiert une réponse 200 OK
        return ResponseEntity.ok(ApiResponse.success("OK"));
    }
}
