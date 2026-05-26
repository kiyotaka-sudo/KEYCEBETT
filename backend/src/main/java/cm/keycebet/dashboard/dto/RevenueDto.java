package cm.keycebet.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class RevenueDto {
    private String period;
    private LocalDateTime from;
    private LocalDateTime to;
    private BigDecimal totalDeposits;
    private BigDecimal totalWithdrawals;
    private BigDecimal totalStakes;
    private BigDecimal totalWins;
    private BigDecimal grossGamingRevenue;
    private BigDecimal netRevenue;
}
