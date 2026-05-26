package cm.keycebet.betting.dto;

import cm.keycebet.betting.entity.Bet;
import cm.keycebet.betting.entity.BetSelection;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class BetMapper {

    public BetDto toDto(Bet bet) {
        if (bet == null) return null;
        return BetDto.builder()
                .id(bet.getId())
                .userId(bet.getUser() != null ? bet.getUser().getId() : null)
                .betType(bet.getType() != null ? bet.getType().name() : null)
                .totalStake(bet.getTotalStake())
                .totalOdds(bet.getTotalOdds())
                .potentialWin(bet.getPotentialWin())
                .status(bet.getStatus())
                .placedAt(bet.getPlacedAt())
                .settledAt(bet.getSettledAt())
                .selections(bet.getSelections() != null
                        ? bet.getSelections().stream().map(this::toDto).collect(Collectors.toList())
                        : null)
                .build();
    }

    public BetSelectionDto toDto(BetSelection betSelection) {
        if (betSelection == null) return null;
        var odd = betSelection.getOdd();
        var event = odd != null ? odd.getEvent() : null;
        return BetSelectionDto.builder()
                .id(betSelection.getId())
                .oddId(odd != null ? odd.getId() : null)
                .marketType(odd != null ? odd.getMarketType() : null)
                .selection(odd != null ? odd.getSelection() : null)
                .oddValueAtBetTime(betSelection.getOddValueAtBetTime())
                .status(betSelection.getStatus())
                .homeTeam(event != null ? event.getHomeTeam() : null)
                .awayTeam(event != null ? event.getAwayTeam() : null)
                .eventName(event != null ? event.getHomeTeam() + " vs " + event.getAwayTeam() : null)
                .build();
    }
}
