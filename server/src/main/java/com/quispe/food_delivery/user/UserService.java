package com.quispe.food_delivery.user;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quispe.food_delivery.common.exception.BusinessException;
import com.quispe.food_delivery.common.exception.ResourceNotFoundException;
import com.quispe.food_delivery.user.dto.UpdateUserDto;
import com.quispe.food_delivery.user.dto.UserResponseDto;
import com.quispe.food_delivery.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDto update(Long id, UpdateUserDto request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        if (request.email() != null) {

            if (!user.getEmail().equals(request.email())
                    && userRepository.existsByEmail(request.email())) {
                throw new BusinessException("E-mail já cadastrado.");
            }

            user.setEmail(request.email());
        }

        if (request.name() != null) {
            user.setName(request.name());
        }

        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        if (request.role() != null) {
            user.setRole(request.role());
        }

        User updatedUser = userRepository.save(user);
        return UserResponseDto.from(updatedUser);
    }

    public List<UserResponseDto> findAll(String search) {
        List<User> users;

        if (search == null || search.isBlank()) {
            users = userRepository.findAll();
        } else {
            users = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(search, search);
        }

        return users.stream()
                .map(UserResponseDto::from)
                .toList();
    }
}