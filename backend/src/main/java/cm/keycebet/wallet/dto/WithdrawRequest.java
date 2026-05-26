package cm.keycebet.wallet.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class WithdrawRequest {

    @NotNull(message = "Le montant est requis")
    @DecimalMin(value = "1000", message = "Le retrait minimum est de 1000 FCFA")
    private BigDecimal amount;

    @NotBlank(message = "Le fournisseur de paiement est requis")
    private String provider;  // MTN_MOMO, ORANGE_MONEY

    @NotBlank(message = "Le numéro de téléphone est requis")
    @Pattern(regexp = "^\\+237[0-9]{9}$", message = "Format de téléphone invalide")
    private String phoneNumber;
}
