package cm.keycebet.sports.service;

import cm.keycebet.common.exception.ResourceNotFoundException;
import cm.keycebet.sports.dto.LeagueDto;
import cm.keycebet.sports.dto.SportsMapper;
import cm.keycebet.sports.entity.League;
import cm.keycebet.sports.entity.Sport;
import cm.keycebet.sports.repository.LeagueRepository;
import cm.keycebet.sports.repository.SportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeagueService {

    private final LeagueRepository leagueRepository;
    private final SportRepository  sportRepository;
    private final SportsMapper     sportsMapper;

    @Transactional(readOnly = true)
    public List<LeagueDto> getLeagues(Long sportId) {
        List<League> leagues = (sportId != null)
                ? leagueRepository.findBySportIdAndIsActiveTrueOrderByNameAsc(sportId)
                : leagueRepository.findByIsActiveTrueOrderByNameAsc();
        return leagues.stream().map(sportsMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public LeagueDto getById(Long id) {
        League league = leagueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("League", id));
        return sportsMapper.toDto(league);
    }

    @Transactional
    public LeagueDto create(Long sportId, String name, String country, String logo) {
        Sport sport = sportRepository.findById(sportId)
                .orElseThrow(() -> new ResourceNotFoundException("Sport", sportId));
        League league = League.builder()
                .sport(sport).name(name).country(country).logo(logo).build();
        return sportsMapper.toDto(leagueRepository.save(league));
    }
}
