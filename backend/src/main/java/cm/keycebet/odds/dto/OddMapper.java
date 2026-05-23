package cm.keycebet.odds.dto;

import cm.keycebet.odds.entity.Odd;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface OddMapper {

    @Mapping(source = "event.id", target = "eventId")
    OddDto toDto(Odd odd);
}
