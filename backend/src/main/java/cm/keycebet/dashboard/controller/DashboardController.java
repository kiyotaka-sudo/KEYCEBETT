package cm.keycebet.dashboard.controller;

import cm.keycebet.betting.dto.BetDto;
import cm.keycebet.betting.service.BetService;
import cm.keycebet.common.enums.BetStatus;
import cm.keycebet.common.response.ApiResponse;
import cm.keycebet.dashboard.dto.DashboardStatsDto;
import cm.keycebet.dashboard.dto.RevenueDto;
import cm.keycebet.dashboard.service.DashboardService;
import cm.keycebet.odds.dto.OddDto;
import cm.keycebet.odds.service.OddService;
import cm.keycebet.sports.dto.EventDto;
import cm.keycebet.sports.service.EventService;
import cm.keycebet.common.enums.EventStatus;
import cm.keycebet.user.dto.UserDto;
import cm.keycebet.user.service.UserService;
import cm.keycebet.wallet.dto.TransactionDto;
import cm.keycebet.wallet.service.WalletService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Dashboard Admin", description = "Statistiques et gestion administrative")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService      userService;
    private final BetService       betService;
    private final WalletService    walletService;
    private final EventService     eventService;
    private final OddService       oddService;

    // ─── Dashboard ────────────────────────────────────────────────────────────

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Statistiques globales")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getStats()));
    }

    @GetMapping("/dashboard/revenue")
    @Operation(summary = "Revenus par période (day|week|month|year)")
    public ResponseEntity<ApiResponse<RevenueDto>> getRevenue(
            @RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getRevenue(period)));
    }

    // ─── Admin Users ──────────────────────────────────────────────────────────

    @GetMapping("/admin/users")
    @Operation(summary = "Lister tous les utilisateurs")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAllUsers(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers(pageable)));
    }

    @PutMapping("/admin/users/{id}/status")
    @Operation(summary = "Activer / Désactiver un utilisateur")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> body) {
        return ResponseEntity.ok(ApiResponse.success(
                "Statut mis à jour", userService.updateUserStatus(id, body.get("isActive"))));
    }

    // ─── Admin Bets ───────────────────────────────────────────────────────────

    @GetMapping("/admin/bets")
    @Operation(summary = "Tous les paris")
    public ResponseEntity<ApiResponse<Page<BetDto>>> getAllBets(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(betService.getAllBets(pageable)));
    }

    @PutMapping("/admin/bets/{id}/settle")
    @Operation(summary = "Régler un pari manuellement")
    public ResponseEntity<ApiResponse<BetDto>> settleBet(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        BetStatus status = BetStatus.valueOf(body.get("status").toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Pari réglé", betService.settleBet(id, status)));
    }

    // ─── Admin Transactions ───────────────────────────────────────────────────

    @GetMapping("/admin/transactions")
    @Operation(summary = "Toutes les transactions")
    public ResponseEntity<ApiResponse<Page<TransactionDto>>> getAllTransactions(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(walletService.getAllTransactions(pageable)));
    }

    // ─── Admin Events ─────────────────────────────────────────────────────────

    @PostMapping("/admin/events")
    @Operation(summary = "Créer un événement")
    public ResponseEntity<ApiResponse<EventDto>> createEvent(@RequestBody Map<String, Object> body) {
        Long leagueId    = Long.valueOf(body.get("leagueId").toString());
        String homeTeam  = body.get("homeTeam").toString();
        String awayTeam  = body.get("awayTeam").toString();
        LocalDateTime st = LocalDateTime.parse(body.get("startTime").toString());
        String extId     = body.containsKey("externalId") ? body.get("externalId").toString() : null;
        return ResponseEntity.ok(ApiResponse.success(
                "Événement créé", eventService.create(leagueId, homeTeam, awayTeam, st, extId)));
    }

    @PutMapping("/admin/events/{id}")
    @Operation(summary = "Mettre à jour un événement (score, statut)")
    public ResponseEntity<ApiResponse<EventDto>> updateEvent(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        EventStatus status = body.containsKey("status")
                ? EventStatus.valueOf(body.get("status").toString()) : null;
        Integer homeScore = body.containsKey("homeScore")
                ? Integer.parseInt(body.get("homeScore").toString()) : null;
        Integer awayScore = body.containsKey("awayScore")
                ? Integer.parseInt(body.get("awayScore").toString()) : null;
        return ResponseEntity.ok(ApiResponse.success(
                "Événement mis à jour", eventService.update(id, status, homeScore, awayScore)));
    }

    // ─── Admin Odds ───────────────────────────────────────────────────────────

    @PostMapping("/admin/odds")
    @Operation(summary = "Créer ou mettre à jour une cote")
    public ResponseEntity<ApiResponse<OddDto>> createOrUpdateOdd(@RequestBody Map<String, Object> body) {
        Long eventId     = Long.valueOf(body.get("eventId").toString());
        String market    = body.get("marketType").toString();
        String selection = body.get("selection").toString();
        BigDecimal value = new BigDecimal(body.get("value").toString());
        return ResponseEntity.ok(ApiResponse.success(
                "Cote mise à jour", oddService.createOrUpdate(eventId, market, selection, value)));
    }
}
