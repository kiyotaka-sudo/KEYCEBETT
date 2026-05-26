package cm.keycebet.wallet.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
public class WalletDto {
    private UUID userId;
    private BigDecimal balance;
    private String currency;
}
