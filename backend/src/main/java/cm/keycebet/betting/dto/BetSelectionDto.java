package cm.keycebet.betting.dto;

import cm.keycebet.common.enums.BetStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BetSelectionDto {
    private Long id;
    private Long oddId;
    private String marketType;
    private String selection;
    private BigDecimal oddValueAtBetTime;
    private BetStatus status;
    private String homeTeam;
    private String awayTeam;
    private String eventName;
}
