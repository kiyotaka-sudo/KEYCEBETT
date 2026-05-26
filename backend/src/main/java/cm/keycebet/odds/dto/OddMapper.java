package cm.keycebet.odds.dto;

import cm.keycebet.odds.entity.Odd;
import org.springframework.stereotype.Component;

@Component
public class OddMapper {

    public OddDto toDto(Odd odd) {
        if (odd == null) return null;
        return OddDto.builder()
                .id(odd.getId())
                .eventId(odd.getEvent() != null ? odd.getEvent().getId() : null)
                .marketType(odd.getMarketType())
                .selection(odd.getSelection())
                .value(odd.getValue())
                .isActive(odd.isActive())
                .updatedAt(odd.getUpdatedAt())
                .build();
    }
}
