package cm.keycebet.auth.dto;

import cm.keycebet.user.dto.UserDto;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private long expiresIn;
    private UserDto user;
}
