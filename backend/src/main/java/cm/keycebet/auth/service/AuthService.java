package cm.keycebet.auth.service;

import cm.keycebet.auth.dto.AuthResponse;
import cm.keycebet.auth.dto.LoginRequest;
import cm.keycebet.auth.dto.RegisterRequest;
import cm.keycebet.auth.security.JwtService;
import cm.keycebet.common.exception.ResourceNotFoundException;
import cm.keycebet.user.dto.UserDto;
import cm.keycebet.user.dto.UserMapper;
import cm.keycebet.user.entity.User;
import cm.keycebet.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Vérification unicité
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Ce nom d'utilisateur est déjà pris");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new IllegalArgumentException("Ce numéro de téléphone est déjà utilisé");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .build();

        user = userRepository.save(user);
        log.info("Nouvel utilisateur enregistré : {}", user.getEmail());

        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .or(() -> userRepository.findByUsername(request.getEmail()))
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", request.getEmail()));

        log.info("Connexion réussie pour : {}", user.getEmail());
        return buildAuthResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        String username = jwtService.getUsernameFromRefreshToken(refreshToken);
        if (username == null) {
            throw new IllegalArgumentException("Refresh token invalide ou expiré");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", username));

        // Invalider l'ancien refresh token
        jwtService.deleteRefreshToken(refreshToken);

        return buildAuthResponse(user);
    }

    public void logout(String accessToken, String refreshToken) {
        if (accessToken != null) {
            jwtService.blacklistToken(accessToken);
        }
        if (refreshToken != null) {
            jwtService.deleteRefreshToken(refreshToken);
        }
        log.info("Déconnexion effectuée");
    }

    // ─── Utilitaire ───────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String accessToken  = jwtService.generateAccessToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);
        UserDto userDto     = userMapper.toDto(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .user(userDto)
                .build();
    }
}
