package cm.keycebet.auth.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Le nom d'utilisateur est requis")
    @Size(min = 3, max = 50, message = "Le nom d'utilisateur doit faire entre 3 et 50 caractères")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et underscores")
    private String username;

    @NotBlank(message = "L'email est requis")
    @Email(message = "Format d'email invalide")
    private String email;

    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 8, message = "Le mot de passe doit faire au moins 8 caractères")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
             message = "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre")
    private String password;

    @NotBlank(message = "Le numéro de téléphone est requis")
    @Pattern(regexp = "^\\+237[0-9]{9}$",
             message = "Le téléphone doit être au format camerounais : +237XXXXXXXXX")
    private String phone;
}
