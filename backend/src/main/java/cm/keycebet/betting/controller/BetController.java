package cm.keycebet.betting.controller;

import cm.keycebet.betting.dto.BetDto;
import cm.keycebet.betting.dto.BetRequest;
import cm.keycebet.betting.service.BetService;
import cm.keycebet.common.enums.BetStatus;
import cm.keycebet.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/bets")
@RequiredArgsConstructor
@Tag(name = "Paris", description = "Placement et suivi des paris sportifs")
@SecurityRequirement(name = "bearerAuth")
public class BetController {

    private final BetService betService;

    @PostMapping
    @Operation(summary = "Placer un pari (simple ou combiné)")
    public ResponseEntity<ApiResponse<BetDto>> placeBet(@Valid @RequestBody BetRequest request) {
        BetDto bet = betService.placeBet(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pari placé avec succès", bet));
    }

    @GetMapping("/my")
    @Operation(summary = "Mes paris")
    public ResponseEntity<ApiResponse<Page<BetDto>>> getMyBets(
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(betService.getMyBets(pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'un pari")
    public ResponseEntity<ApiResponse<BetDto>> getBet(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(betService.getBetById(id)));
    }

    @PostMapping("/{id}/cashout")
    @Operation(summary = "Cashout d'un pari (STUB)")
    public ResponseEntity<ApiResponse<BetDto>> cashOut(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(betService.cashOut(id)));
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Tous les paris (Admin)")
    public ResponseEntity<ApiResponse<Page<BetDto>>> getAllBets(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(betService.getAllBets(pageable)));
    }

    @PutMapping("/admin/{id}/settle")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Régler un pari manuellement (Admin)")
    public ResponseEntity<ApiResponse<BetDto>> settleBet(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        BetStatus status = BetStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Pari réglé", betService.settleBet(id, status)));
    }
}
