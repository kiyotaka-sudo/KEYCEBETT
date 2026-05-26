package cm.keycebet.betting.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class BetRequest {

    @NotNull(message = "La mise est requise")
    @DecimalMin(value = "100", message = "La mise minimum est de 100 FCFA")
    @DecimalMax(value = "500000", message = "La mise maximum est de 500 000 FCFA")
    private BigDecimal stake;

    @NotEmpty(message = "Au moins une sélection est requise")
    @Size(max = 15, message = "Maximum 15 sélections pour un pari combiné")
    private List<Long> oddIds;
}
