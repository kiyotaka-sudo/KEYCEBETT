package cm.keycebet.odds.service;

import cm.keycebet.common.exception.ResourceNotFoundException;
import cm.keycebet.odds.dto.OddDto;
import cm.keycebet.odds.dto.OddMapper;
import cm.keycebet.odds.entity.Odd;
import cm.keycebet.odds.repository.OddRepository;
import cm.keycebet.sports.entity.Event;
import cm.keycebet.sports.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OddService {

    private final OddRepository   oddRepository;
    private final EventRepository eventRepository;
    private final OddMapper       oddMapper;

    @Cacheable(value = "odds", key = "#eventId")
    @Transactional(readOnly = true)
    public List<OddDto> getOddsByEvent(Long eventId) {
        return oddRepository
                .findByEventIdAndIsActiveTrueOrderByMarketTypeAscSelectionAsc(eventId)
                .stream().map(oddMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public OddDto getById(Long id) {
        Odd odd = oddRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cote", id));
        return oddMapper.toDto(odd);
    }

    @CacheEvict(value = "odds", key = "#eventId")
    @Transactional
    public OddDto createOrUpdate(Long eventId, String marketType,
                                 String selection, BigDecimal value) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Événement", eventId));

        // Chercher une cote existante pour ce marché/sélection
        Odd odd = oddRepository.findByEventId(eventId).stream()
                .filter(o -> o.getMarketType().equals(marketType)
                          && o.getSelection().equals(selection))
                .findFirst()
                .orElse(Odd.builder().event(event)
                        .marketType(marketType).selection(selection).build());

        odd.setValue(value);
        odd.setActive(true);
        return oddMapper.toDto(oddRepository.save(odd));
    }
}
