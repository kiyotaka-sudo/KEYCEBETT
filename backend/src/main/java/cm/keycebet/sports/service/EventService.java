package cm.keycebet.sports.service;

import cm.keycebet.common.enums.EventStatus;
import cm.keycebet.common.exception.ResourceNotFoundException;
import cm.keycebet.sports.dto.EventDto;
import cm.keycebet.sports.dto.SportsMapper;
import cm.keycebet.sports.entity.Event;
import cm.keycebet.sports.entity.League;
import cm.keycebet.sports.repository.EventRepository;
import cm.keycebet.sports.repository.LeagueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository  eventRepository;
    private final LeagueRepository leagueRepository;
    private final SportsMapper     sportsMapper;

    @Transactional(readOnly = true)
    public Page<EventDto> getEvents(Long leagueId, EventStatus status, LocalDate date, Pageable pageable) {
        LocalDateTime from = (date != null) ? date.atStartOfDay() : null;
        LocalDateTime to   = (date != null) ? date.atTime(23, 59, 59) : null;
        return eventRepository.findFiltered(leagueId, status, from, to, pageable)
                .map(sportsMapper::toDto);
    }

    @Transactional(readOnly = true)
    public EventDto getById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Événement", id));
        return sportsMapper.toDto(event);
    }

    @Transactional(readOnly = true)
    public List<EventDto> getLiveEvents() {
        /**
         * TODO - AMI 2 : Intégrer l'API de résultats sportifs ici
         * Providers suggérés : API-Football, SportRadar, TheSportsDB
         * Variable d'env : SPORTS_API_KEY, SPORTS_API_URL
         * Cette méthode doit fetcher les scores en temps réel
         * et déclencher le settlement automatique des paris
         */
        log.info("[STUB] getLiveEvents — à connecter avec l'API de résultats en temps réel");
        return eventRepository.findByStatus(EventStatus.LIVE)
                .stream().map(sportsMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<EventDto> getResults() {
        /**
         * TODO - AMI 2 : Intégrer l'API de résultats sportifs ici
         * Providers suggérés : API-Football, SportRadar, TheSportsDB
         * Variable d'env : SPORTS_API_KEY, SPORTS_API_URL
         * Cette méthode doit fetcher les résultats finaux
         * et permettre le settlement des paris terminés
         */
        log.info("[STUB] getResults — à connecter avec l'API de résultats");
        return eventRepository.findByStatus(EventStatus.FINISHED)
                .stream().map(sportsMapper::toDto).toList();
    }

    @Transactional
    public EventDto create(Long leagueId, String homeTeam, String awayTeam,
                           LocalDateTime startTime, String externalId) {
        League league = leagueRepository.findById(leagueId)
                .orElseThrow(() -> new ResourceNotFoundException("League", leagueId));
        Event event = Event.builder()
                .league(league).homeTeam(homeTeam).awayTeam(awayTeam)
                .startTime(startTime).externalId(externalId).build();
        return sportsMapper.toDto(eventRepository.save(event));
    }

    @Transactional
    public EventDto update(Long id, EventStatus status, Integer homeScore, Integer awayScore) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Événement", id));
        if (status != null)    event.setStatus(status);
        if (homeScore != null) event.setHomeScore(homeScore);
        if (awayScore != null) event.setAwayScore(awayScore);
        return sportsMapper.toDto(eventRepository.save(event));
    }
}
