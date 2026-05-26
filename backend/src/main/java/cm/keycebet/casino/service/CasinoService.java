package cm.keycebet.casino.service;

import cm.keycebet.casino.dto.CasinoGameDto;
import cm.keycebet.casino.entity.CasinoGame;
import cm.keycebet.casino.repository.CasinoGameRepository;
import cm.keycebet.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CasinoService {

    private final CasinoGameRepository casinoGameRepository;

    @Transactional(readOnly = true)
    public List<CasinoGameDto> getAllGames() {
        return casinoGameRepository.findAllByOrderByDisplayOrderAsc()
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public CasinoGameDto getById(Long id) {
        CasinoGame game = casinoGameRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Jeu casino", id));
        return toDto(game);
    }

    private CasinoGameDto toDto(CasinoGame game) {
        return CasinoGameDto.builder()
                .id(game.getId())
                .name(game.getName())
                .provider(game.getProvider())
                .type(game.getType())
                .thumbnail(game.getThumbnail())
                .isAvailable(game.isAvailable())
                .comingSoon(game.isComingSoon())
                .displayOrder(game.getDisplayOrder())
                .build();
    }
}
