package cm.keycebet.odds.entity;

import cm.keycebet.sports.entity.Event;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "odds",
       uniqueConstraints = @UniqueConstraint(
               columnNames = {"event_id", "market_type", "selection"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Odd {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(name = "market_type", nullable = false, length = 50)
    private String marketType;   // 1X2, OVER_UNDER, BTTS, HANDICAP...

    @Column(nullable = false, length = 50)
    private String selection;    // HOME, DRAW, AWAY, OVER, UNDER, YES, NO...

    @Column(nullable = false, precision = 8, scale = 3)
    private BigDecimal value;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
