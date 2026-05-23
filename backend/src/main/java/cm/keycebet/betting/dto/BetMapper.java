package cm.keycebet.betting.dto;

import cm.keycebet.betting.entity.Bet;
import cm.keycebet.betting.entity.BetSelection;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface BetMapper {

    @Mapping(source = "user.id",   target = "userId")
    @Mapping(source = "type",      target = "betType")
    BetDto toDto(Bet bet);

    @Mapping(source = "odd.id",          target = "oddId")
    @Mapping(source = "odd.marketType",  target = "marketType")
    @Mapping(source = "odd.selection",   target = "selection")
    @Mapping(source = "odd.event.homeTeam", target = "homeTeam")
    @Mapping(source = "odd.event.awayTeam", target = "awayTeam")
    @Mapping(expression = "java(betSelection.getOdd().getEvent().getHomeTeam() + \" vs \" + betSelection.getOdd().getEvent().getAwayTeam())",
             target = "eventName")
    BetSelectionDto toDto(BetSelection betSelection);
}
