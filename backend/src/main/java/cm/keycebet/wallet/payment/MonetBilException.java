package cm.keycebet.wallet.payment;

/**
 * Exception levée lors d'un problème de communication avec l'API MonetBil.
 */
public class MonetBilException extends RuntimeException {

    public MonetBilException(String message) {
        super(message);
    }

    public MonetBilException(String message, Throwable cause) {
        super(message, cause);
    }
}
