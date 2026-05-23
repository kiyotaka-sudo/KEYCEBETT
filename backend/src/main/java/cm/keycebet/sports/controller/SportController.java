package cm.keycebet.sports.controller;

import cm.keycebet.common.response.ApiResponse;
import cm.keycebet.sports.dto.SportDto;
import cm.keycebet.sports.service.SportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sports")
@RequiredArgsConstructor
@Tag(name = "Sports", description = "Liste des sports disponibles")
public class SportController {

    private final SportService sportService;

    @GetMapping
    @Operation(summary = "Lister tous les sports actifs")
    public ResponseEntity<ApiResponse<List<SportDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(sportService.getAllActive()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un sport par ID")
    public ResponseEntity<ApiResponse<SportDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(sportService.getById(id)));
    }
}
