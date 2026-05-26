package cm.keycebet.dashboard.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardStatsDto {
    private long totalUsers;
    private long activeUsers;
    private long totalBets;
    private long pendingBets;
    private long wonBets;
    private long lostBets;
    private BigDecimal totalDeposits;
    private BigDecimal totalWithdrawals;
    private BigDecimal totalBetStakes;
    private BigDecimal totalWinsPaid;
    private BigDecimal grossGamingRevenue;   // Stakes - Wins
    private long totalEvents;
    private long liveEvents;
}
