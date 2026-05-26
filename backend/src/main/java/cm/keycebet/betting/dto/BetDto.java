package cm.keycebet.betting.dto;

import cm.keycebet.common.enums.BetStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class BetDto {
    private UUID id;
    private UUID userId;
    private String betType;
    private BigDecimal totalStake;
    private BigDecimal totalOdds;
    private BigDecimal potentialWin;
    private BetStatus status;
    private LocalDateTime placedAt;
    private LocalDateTime settledAt;
    private List<BetSelectionDto> selections;
}
