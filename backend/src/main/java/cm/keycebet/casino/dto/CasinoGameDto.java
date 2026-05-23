package cm.keycebet.casino.dto;

import cm.keycebet.common.enums.GameStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CasinoGameDto {
    private Long id;
    private String name;
    private String provider;
    private GameStatus type;
    private String thumbnail;
    private boolean isAvailable;
    private boolean comingSoon;
    private int displayOrder;
}
