package cm.keycebet.sports.controller;

import cm.keycebet.common.response.ApiResponse;
import cm.keycebet.sports.dto.LeagueDto;
import cm.keycebet.sports.service.LeagueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leagues")
@RequiredArgsConstructor
@Tag(name = "Leagues", description = "Compétitions sportives")
public class LeagueController {

    private final LeagueService leagueService;

    @GetMapping
    @Operation(summary = "Lister les ligues, filtrable par sport")
    public ResponseEntity<ApiResponse<List<LeagueDto>>> getAll(
            @RequestParam(required = false) Long sportId) {
        return ResponseEntity.ok(ApiResponse.success(leagueService.getLeagues(sportId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir une ligue par ID")
    public ResponseEntity<ApiResponse<LeagueDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(leagueService.getById(id)));
    }
}
