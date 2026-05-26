package cm.keycebet.wallet.payment;

import lombok.Data;

/**
 * DTO représentant les paramètres reçus par notre webhook
 * lorsque MonetBil appelle notre notify_url.
 *
 * Référence : https://www.monetbil.com/docs/monetbil-payment-notification-en.pdf
 */
@Data
public class MonetBilWebhookPayload {

    /**
     * Statut numérique du paiement :
     *  1  = Succès
     *  0  = Échec
     * -1  = Annulé
     * -2  = Remboursé
     */
    private String status;

    /** Notre référence interne (payment_ref envoyé lors du placePayment) */
    private String payment_ref;

    /** ID de transaction généré par MonetBil */
    private String transaction_id;

    /** UUID de transaction MonetBil */
    private String transaction_uuid;

    /** Montant de la transaction */
    private String amount;

    /** Devise (XAF) */
    private String currency;

    /** Numéro de téléphone utilisé */
    private String phone;

    /** Code opérateur (CM_MTNMOBILEMONEY / CM_ORANGEMONEY) */
    private String operator;

    /** Pays */
    private String country;

    /** paymentId MonetBil (même valeur que renvoyée par placePayment) */
    private String paymentId;
}
