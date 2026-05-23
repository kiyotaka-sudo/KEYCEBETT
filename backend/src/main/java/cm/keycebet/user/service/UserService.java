package cm.keycebet.user.service;

import cm.keycebet.common.exception.ResourceNotFoundException;
import cm.keycebet.user.dto.UserDto;
import cm.keycebet.user.dto.UserMapper;
import cm.keycebet.user.entity.User;
import cm.keycebet.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", email));
        return userMapper.toDto(user);
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));
        return userMapper.toDto(user);
    }

    @Transactional
    public UserDto updateCurrentUser(String username, String phone) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", email));

        if (username != null && !username.isBlank()) {
            if (userRepository.existsByUsername(username) && !user.getUsername().equals(username)) {
                throw new IllegalArgumentException("Ce nom d'utilisateur est déjà pris");
            }
            user.setUsername(username);
        }
        if (phone != null && !phone.isBlank()) {
            if (userRepository.existsByPhone(phone) && !user.getPhone().equals(phone)) {
                throw new IllegalArgumentException("Ce numéro de téléphone est déjà utilisé");
            }
            user.setPhone(phone);
        }

        return userMapper.toDto(userRepository.save(user));
    }

    @Transactional
    public void changePassword(String currentPassword, String newPassword) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", email));

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Le mot de passe actuel est incorrect");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Mot de passe modifié pour l'utilisateur : {}", email);
    }

    // ─── Admin ───────────────────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public Page<UserDto> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toDto);
    }

    @Transactional
    public UserDto updateUserStatus(UUID id, boolean isActive) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur", id));
        user.setActive(isActive);
        return userMapper.toDto(userRepository.save(user));
    }
}
