package cm.keycebet.wallet.dto;

import cm.keycebet.common.enums.TransactionStatus;
import cm.keycebet.common.enums.TransactionType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TransactionDto {
    private UUID id;
    private TransactionType type;
    private BigDecimal amount;
    private TransactionStatus status;
    private String reference;
    private String provider;
    private LocalDateTime createdAt;
}
