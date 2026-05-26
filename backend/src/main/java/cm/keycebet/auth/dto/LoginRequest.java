package cm.keycebet.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "L'email ou nom d'utilisateur est requis")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    private String password;
}
