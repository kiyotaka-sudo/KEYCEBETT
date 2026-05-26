package cm.keycebet.notification.service;

import cm.keycebet.betting.dto.BetDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    @Async
    public void notifyBetPlaced(BetDto bet) {
        try {
            messagingTemplate.convertAndSendToUser(
                    bet.getUserId().toString(),
                    "/queue/bets",
                    bet
            );
            log.debug("Notification 'pari placé' envoyée — betId={}", bet.getId());
        } catch (Exception e) {
            log.warn("Impossible d'envoyer la notification WebSocket : {}", e.getMessage());
        }
    }

    @Async
    public void notifyBetSettled(BetDto bet) {
        try {
            messagingTemplate.convertAndSendToUser(
                    bet.getUserId().toString(),
                    "/queue/bets",
                    bet
            );
            // Broadcast sur le topic public des résultats
            messagingTemplate.convertAndSend("/topic/bet-results", bet);
            log.debug("Notification 'pari réglé' envoyée — betId={} status={}", bet.getId(), bet.getStatus());
        } catch (Exception e) {
            log.warn("Impossible d'envoyer la notification WebSocket : {}", e.getMessage());
        }
    }

    @Async
    public void broadcastOddsUpdate(Long eventId, Object oddsUpdate) {
        try {
            messagingTemplate.convertAndSend("/topic/odds/" + eventId, oddsUpdate);
            log.debug("Cotes mises à jour broadcastées — eventId={}", eventId);
        } catch (Exception e) {
            log.warn("Impossible de broadcaster les cotes : {}", e.getMessage());
        }
    }
}
