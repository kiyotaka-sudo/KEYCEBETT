package cm.keycebet.sports.service;

import cm.keycebet.common.exception.ResourceNotFoundException;
import cm.keycebet.sports.dto.SportDto;
import cm.keycebet.sports.dto.SportsMapper;
import cm.keycebet.sports.entity.Sport;
import cm.keycebet.sports.repository.SportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SportService {

    private final SportRepository sportRepository;
    private final SportsMapper sportsMapper;

    @Transactional(readOnly = true)
    public List<SportDto> getAllActive() {
        return sportRepository.findByIsActiveTrueOrderByDisplayOrderAsc()
                .stream().map(sportsMapper::toDto).toList();
    }

    @Transactional(readOnly = true)
    public SportDto getById(Long id) {
        Sport sport = sportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sport", id));
        return sportsMapper.toDto(sport);
    }

    @Transactional
    public SportDto create(String name, String icon, int displayOrder) {
        Sport sport = Sport.builder()
                .name(name).icon(icon).displayOrder(displayOrder).build();
        return sportsMapper.toDto(sportRepository.save(sport));
    }
}
