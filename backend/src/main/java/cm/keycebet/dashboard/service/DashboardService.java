package cm.keycebet.dashboard.service;

import cm.keycebet.betting.repository.BetRepository;
import cm.keycebet.common.enums.BetStatus;
import cm.keycebet.common.enums.EventStatus;
import cm.keycebet.common.enums.TransactionType;
import cm.keycebet.dashboard.dto.DashboardStatsDto;
import cm.keycebet.dashboard.dto.RevenueDto;
import cm.keycebet.sports.repository.EventRepository;
import cm.keycebet.user.repository.UserRepository;
import cm.keycebet.wallet.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository        userRepository;
    private final BetRepository         betRepository;
    private final EventRepository       eventRepository;
    private final TransactionRepository transactionRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getStats() {
        long totalUsers   = userRepository.count();
        long totalBets    = betRepository.count();
        long pendingBets  = betRepository.countByStatus(BetStatus.PENDING);
        long wonBets      = betRepository.countByStatus(BetStatus.WON);
        long lostBets     = betRepository.countByStatus(BetStatus.LOST);
        long totalEvents  = eventRepository.count();
        long liveEvents   = eventRepository.findByStatus(EventStatus.LIVE).size();

        LocalDateTime from = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
        LocalDateTime to   = LocalDateTime.now();

        BigDecimal deposits    = safeSum(TransactionType.DEPOSIT,    from, to);
        BigDecimal withdrawals = safeSum(TransactionType.WITHDRAWAL, from, to);
        BigDecimal stakes      = safeSum(TransactionType.BET_STAKE,  from, to);
        BigDecimal wins        = safeSum(TransactionType.BET_WIN,    from, to);
        BigDecimal ggr         = stakes.subtract(wins);

        return DashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .activeUsers(totalUsers)
                .totalBets(totalBets)
                .pendingBets(pendingBets)
                .wonBets(wonBets)
                .lostBets(lostBets)
                .totalDeposits(deposits)
                .totalWithdrawals(withdrawals)
                .totalBetStakes(stakes)
                .totalWinsPaid(wins)
                .grossGamingRevenue(ggr)
                .totalEvents(totalEvents)
                .liveEvents(liveEvents)
                .build();
    }

    @Transactional(readOnly = true)
    public RevenueDto getRevenue(String period) {
        LocalDateTime to   = LocalDateTime.now();
        LocalDateTime from = switch (period.toLowerCase()) {
            case "day"   -> to.minus(1,  ChronoUnit.DAYS);
            case "week"  -> to.minus(7,  ChronoUnit.DAYS);
            case "month" -> to.minus(30, ChronoUnit.DAYS);
            case "year"  -> to.minus(365, ChronoUnit.DAYS);
            default      -> to.minus(30, ChronoUnit.DAYS);
        };

        BigDecimal deposits    = safeSum(TransactionType.DEPOSIT,    from, to);
        BigDecimal withdrawals = safeSum(TransactionType.WITHDRAWAL, from, to);
        BigDecimal stakes      = safeSum(TransactionType.BET_STAKE,  from, to);
        BigDecimal wins        = safeSum(TransactionType.BET_WIN,    from, to);
        BigDecimal ggr         = stakes.subtract(wins);
        BigDecimal net         = deposits.subtract(withdrawals);

        return RevenueDto.builder()
                .period(period)
                .from(from).to(to)
                .totalDeposits(deposits)
                .totalWithdrawals(withdrawals)
                .totalStakes(stakes)
                .totalWins(wins)
                .grossGamingRevenue(ggr)
                .netRevenue(net)
                .build();
    }

    private BigDecimal safeSum(TransactionType type, LocalDateTime from, LocalDateTime to) {
        BigDecimal result = transactionRepository.sumByTypeAndPeriod(type, from, to);
        return result != null ? result : BigDecimal.ZERO;
    }
}
