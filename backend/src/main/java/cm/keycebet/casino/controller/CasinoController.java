package cm.keycebet.casino.controller;

import cm.keycebet.casino.dto.CasinoGameDto;
import cm.keycebet.casino.service.CasinoService;
import cm.keycebet.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/casino")
@RequiredArgsConstructor
@Tag(name = "Casino", description = "Jeux casino (coming soon)")
public class CasinoController {

    private final CasinoService casinoService;

    @GetMapping("/games")
    @Operation(summary = "Lister tous les jeux casino")
    public ResponseEntity<ApiResponse<List<CasinoGameDto>>> getAllGames() {
        return ResponseEntity.ok(ApiResponse.success(casinoService.getAllGames()));
    }

    @GetMapping("/games/{id}")
    @Operation(summary = "Détail d'un jeu casino")
    public ResponseEntity<ApiResponse<CasinoGameDto>> getGame(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(casinoService.getById(id)));
    }
}
