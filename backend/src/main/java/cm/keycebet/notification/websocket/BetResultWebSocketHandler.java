package cm.keycebet.notification.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

/**
 * Gestionnaire WebSocket STOMP pour les résultats de paris.
 * Les clients s'abonnent à /topic/bet-results pour recevoir
 * les mises à jour en temps réel.
 */
@Slf4j
@Controller
public class BetResultWebSocketHandler {

    /**
     * Point d'entrée STOMP — les clients envoient vers /app/bet-ping
     * et reçoivent une réponse sur /topic/bet-results.
     */
    @MessageMapping("/bet-ping")
    @SendTo("/topic/bet-results")
    public String ping(String message) {
        log.debug("WebSocket ping reçu : {}", message);
        return "pong";
    }
}
