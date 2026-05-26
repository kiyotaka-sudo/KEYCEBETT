package cm.keycebet.betting.entity;

import cm.keycebet.common.enums.BetStatus;
import cm.keycebet.common.enums.BetType;
import cm.keycebet.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "bets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Bet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "bet_type")
    private BetType type;

    @Column(name = "total_stake", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalStake;

    @Column(name = "total_odds", nullable = false, precision = 12, scale = 3)
    private BigDecimal totalOdds;

    @Column(name = "potential_win", nullable = false, precision = 15, scale = 2)
    private BigDecimal potentialWin;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "bet_status")
    @Builder.Default
    private BetStatus status = BetStatus.PENDING;

    @Column(name = "placed_at", nullable = false)
    @Builder.Default
    private LocalDateTime placedAt = LocalDateTime.now();

    @Column(name = "settled_at")
    private LocalDateTime settledAt;

    @OneToMany(mappedBy = "bet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<BetSelection> selections = new ArrayList<>();
}
