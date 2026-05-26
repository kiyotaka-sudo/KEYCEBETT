package cm.keycebet.user.dto;

import cm.keycebet.common.enums.UserRole;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class UserDto {

    private UUID id;
    private String username;
    private String email;
    private String phone;
    private BigDecimal balance;
    private UserRole role;
    private boolean kycVerified;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
