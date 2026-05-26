package cm.keycebet.wallet.payment;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Propriétés de configuration MonetBil lues depuis application.yml
 * (section monetbil.*) et surchargées par les variables d'environnement.
 */
@Data
@Component
@ConfigurationProperties(prefix = "monetbil")
public class MonetBilProperties {

    /** Clé de service obtenue dans le dashboard MonetBil */
    private String serviceKey;

    /** Secret de service pour la signature/validation des webhooks */
    private String serviceSecret;

    /** URL de base de l'API MonetBil (ex: https://api.monetbil.com/payment/v1) */
    private String apiUrl = "https://api.monetbil.com/payment/v1";

    /** URL du webhook que MonetBil appellera pour notifier notre backend */
    private String notifyUrl;

    /** Timeout en secondes pour les appels HTTP vers MonetBil */
    private int timeoutSeconds = 30;
}
