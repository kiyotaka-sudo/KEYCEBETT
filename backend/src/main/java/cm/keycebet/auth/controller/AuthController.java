package cm.keycebet.auth.controller;

import cm.keycebet.auth.dto.AuthResponse;
import cm.keycebet.auth.dto.LoginRequest;
import cm.keycebet.auth.dto.RegisterRequest;
import cm.keycebet.auth.service.AuthService;
import cm.keycebet.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentification", description = "Inscription, connexion et gestion des tokens")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Créer un compte utilisateur")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Compte créé avec succès", response));
    }

    @PostMapping("/login")
    @Operation(summary = "Connexion utilisateur")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Connexion réussie", response));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Rafraîchir le token d'accès")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");
        if (!StringUtils.hasText(refreshToken)) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Le refresh token est requis"));
        }
        AuthResponse response = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Token rafraîchi", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Déconnexion")
    public ResponseEntity<ApiResponse<Void>> logout(
            HttpServletRequest request,
            @RequestBody(required = false) Map<String, String> body) {

        String authHeader = request.getHeader("Authorization");
        String accessToken = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7) : null;
        String refreshToken = (body != null) ? body.get("refreshToken") : null;

        authService.logout(accessToken, refreshToken);
        return ResponseEntity.ok(ApiResponse.success("Déconnexion réussie"));
    }
}
