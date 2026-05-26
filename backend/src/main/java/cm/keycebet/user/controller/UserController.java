package cm.keycebet.user.controller;

import cm.keycebet.common.response.ApiResponse;
import cm.keycebet.user.dto.UserDto;
import cm.keycebet.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Utilisateurs", description = "Gestion du profil utilisateur")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Obtenir le profil de l'utilisateur connecté")
    public ResponseEntity<ApiResponse<UserDto>> getMe() {
        return ResponseEntity.ok(ApiResponse.success(userService.getCurrentUser()));
    }

    @PutMapping("/me")
    @Operation(summary = "Mettre à jour le profil")
    public ResponseEntity<ApiResponse<UserDto>> updateMe(@RequestBody Map<String, String> body) {
        UserDto updated = userService.updateCurrentUser(body.get("username"), body.get("phone"));
        return ResponseEntity.ok(ApiResponse.success("Profil mis à jour", updated));
    }

    @PutMapping("/me/password")
    @Operation(summary = "Changer le mot de passe")
    public ResponseEntity<ApiResponse<Void>> changePassword(@RequestBody Map<String, String> body) {
        userService.changePassword(body.get("currentPassword"), body.get("newPassword"));
        return ResponseEntity.ok(ApiResponse.success("Mot de passe modifié avec succès"));
    }
}
