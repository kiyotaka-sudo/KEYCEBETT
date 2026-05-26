package cm.keycebet.sports.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LeagueDto {
    private Long id;
    private Long sportId;
    private String sportName;
    private String name;
    private String country;
    private String logo;
    private boolean isActive;
}
