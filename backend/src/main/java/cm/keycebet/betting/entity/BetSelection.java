package cm.keycebet.betting.entity;

import cm.keycebet.common.enums.BetStatus;
import cm.keycebet.odds.entity.Odd;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;

@Entity
@Table(name = "bet_selections")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class BetSelection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bet_id", nullable = false)
    private Bet bet;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "odd_id", nullable = false)
    private Odd odd;

    @Column(name = "odd_value_at_bet_time", nullable = false, precision = 8, scale = 3)
    private BigDecimal oddValueAtBetTime;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(nullable = false, columnDefinition = "selection_status")
    @Builder.Default
    private BetStatus status = BetStatus.PENDING;
}
