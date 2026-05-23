package cm.keycebet.sports.dto;

import cm.keycebet.sports.entity.Event;
import cm.keycebet.sports.entity.League;
import cm.keycebet.sports.entity.Sport;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SportsMapper {

    SportDto toDto(Sport sport);

    @Mapping(source = "sport.id",   target = "sportId")
    @Mapping(source = "sport.name", target = "sportName")
    LeagueDto toDto(League league);

    @Mapping(source = "league.id",         target = "leagueId")
    @Mapping(source = "league.name",       target = "leagueName")
    @Mapping(source = "league.sport.name", target = "sportName")
    EventDto toDto(Event event);
}
