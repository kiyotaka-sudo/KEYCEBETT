package cm.keycebet.config;

import cm.keycebet.common.enums.UserRole;
import cm.keycebet.user.entity.User;
import cm.keycebet.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:mbargaernest80@gmail.com}")
    private String adminEmail;

    @Value("${app.admin.password:Nash_2006}")
    private String adminPassword;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.phone:+237699000000}")
    private String adminPhone;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Compte admin déjà existant — aucune action requise.");
            return;
        }

        User admin = User.builder()
                .username(adminUsername)
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode(adminPassword))
                .phone(adminPhone)
                .role(UserRole.ADMIN)
                .kycVerified(true)
                .isActive(true)
                .build();

        userRepository.save(admin);
        log.info("✅ Compte admin créé avec succès — email: {}", adminEmail);
    }
}
