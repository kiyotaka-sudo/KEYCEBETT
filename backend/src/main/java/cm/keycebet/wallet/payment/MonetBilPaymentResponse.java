package cm.keycebet.wallet.payment;

import lombok.Data;

/**
 * DTO représentant la réponse de l'API MonetBil au placePayment.
 */
@Data
public class MonetBilPaymentResponse {

    /** Identifiant unique du paiement chez MonetBil */
    private String paymentId;

    /**
     * Statut de la requête d'initiation :
     * 1 = succès de l'initiation (ne signifie pas que le paiement est validé)
     * 0 = échec
     */
    private Integer success;

    /** Message éventuel retourné par l'API */
    private String message;

    /** URL de redirection widget (si applicable) */
    private String paymentUrl;
}
