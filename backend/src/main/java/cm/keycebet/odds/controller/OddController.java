package cm.keycebet.odds.controller;

import cm.keycebet.common.response.ApiResponse;
import cm.keycebet.odds.dto.OddDto;
import cm.keycebet.odds.service.OddService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@Tag(name = "Cotes", description = "Cotes des événements sportifs")
public class OddController {

    private final OddService oddService;

    @GetMapping("/{eventId}/odds")
    @Operation(summary = "Obtenir les cotes d'un événement")
    public ResponseEntity<ApiResponse<List<OddDto>>> getOdds(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(oddService.getOddsByEvent(eventId)));
    }
}
