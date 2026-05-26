package cm.keycebet.odds.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class OddDto {
    private Long id;
    private Long eventId;
    private String marketType;
    private String selection;
    private BigDecimal value;
    private boolean isActive;
    private LocalDateTime updatedAt;
}
