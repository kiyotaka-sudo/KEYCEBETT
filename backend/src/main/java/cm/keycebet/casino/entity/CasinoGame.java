package cm.keycebet.casino.entity;

import cm.keycebet.common.enums.GameStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "casino_games")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CasinoGame {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String name;

    @Column(length = 100)
    private String provider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private GameStatus type;

    @Column(length = 500)
    private String thumbnail;

    @Column(name = "is_available", nullable = false)
    @Builder.Default
    private boolean isAvailable = false;

    @Column(name = "coming_soon", nullable = false)
    @Builder.Default
    private boolean comingSoon = true;

    @Column(name = "display_order", nullable = false)
    @Builder.Default
    private int displayOrder = 0;
}
