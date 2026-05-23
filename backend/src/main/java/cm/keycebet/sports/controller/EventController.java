package cm.keycebet.sports.controller;

import cm.keycebet.common.enums.EventStatus;
import cm.keycebet.common.response.ApiResponse;
import cm.keycebet.sports.dto.EventDto;
import cm.keycebet.sports.service.EventService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@Tag(name = "Événements", description = "Matchs et événements sportifs")
public class EventController {

    private final EventService eventService;

    @GetMapping
    @Operation(summary = "Lister les événements avec filtres")
    public ResponseEntity<ApiResponse<Page<EventDto>>> getAll(
            @RequestParam(required = false) Long leagueId,
            @RequestParam(required = false) EventStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                eventService.getEvents(leagueId, status, date, pageable)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtenir un événement par ID")
    public ResponseEntity<ApiResponse<EventDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getById(id)));
    }

    @GetMapping("/live")
    @Operation(summary = "Événements en direct (STUB — Ami 2)")
    public ResponseEntity<ApiResponse<List<EventDto>>> getLive() {
        return ResponseEntity.ok(ApiResponse.success(eventService.getLiveEvents()));
    }

    @GetMapping("/results")
    @Operation(summary = "Résultats des matchs terminés (STUB — Ami 2)")
    public ResponseEntity<ApiResponse<List<EventDto>>> getResults() {
        return ResponseEntity.ok(ApiResponse.success(eventService.getResults()));
    }
}
