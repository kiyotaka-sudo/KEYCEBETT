package cm.keycebet.sports.dto;

import cm.keycebet.sports.entity.Event;
import cm.keycebet.sports.entity.League;
import cm.keycebet.sports.entity.Sport;
import org.springframework.stereotype.Component;

@Component
public class SportsMapper {

    public SportDto toDto(Sport sport) {
        if (sport == null) return null;
        return SportDto.builder()
                .id(sport.getId())
                .name(sport.getName())
                .icon(sport.getIcon())
                .isActive(sport.isActive())
                .displayOrder(sport.getDisplayOrder())
                .build();
    }

    public LeagueDto toDto(League league) {
        if (league == null) return null;
        return LeagueDto.builder()
                .id(league.getId())
                .sportId(league.getSport() != null ? league.getSport().getId() : null)
                .sportName(league.getSport() != null ? league.getSport().getName() : null)
                .name(league.getName())
                .country(league.getCountry())
                .logo(league.getLogo())
                .isActive(league.isActive())
                .build();
    }

    public EventDto toDto(Event event) {
        if (event == null) return null;
        return EventDto.builder()
                .id(event.getId())
                .leagueId(event.getLeague() != null ? event.getLeague().getId() : null)
                .leagueName(event.getLeague() != null ? event.getLeague().getName() : null)
                .sportName(event.getLeague() != null && event.getLeague().getSport() != null
                        ? event.getLeague().getSport().getName() : null)
                .homeTeam(event.getHomeTeam())
                .awayTeam(event.getAwayTeam())
                .startTime(event.getStartTime())
                .status(event.getStatus())
                .homeScore(event.getHomeScore())
                .awayScore(event.getAwayScore())
                .externalId(event.getExternalId())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
