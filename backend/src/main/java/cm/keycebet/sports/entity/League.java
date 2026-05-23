package cm.keycebet.sports.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "leagues")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class League {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sport_id", nullable = false)
    private Sport sport;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 100)
    private String country;

    @Column(length = 500)
    private String logo;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean isActive = true;
}
