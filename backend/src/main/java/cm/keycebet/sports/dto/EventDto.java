package cm.keycebet.sports.dto;

import cm.keycebet.common.enums.EventStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EventDto {
    private Long id;
    private Long leagueId;
    private String leagueName;
    private String sportName;
    private String homeTeam;
    private String awayTeam;
    private LocalDateTime startTime;
    private EventStatus status;
    private Integer homeScore;
    private Integer awayScore;
    private String externalId;
    private LocalDateTime createdAt;
}
