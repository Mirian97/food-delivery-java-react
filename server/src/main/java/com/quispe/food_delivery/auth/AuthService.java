package com.quispe.food_delivery.auth;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.quispe.food_delivery.auth.dto.LoginRequestDto;
import com.quispe.food_delivery.auth.dto.LoginResponseDto;
import com.quispe.food_delivery.auth.dto.RegisterRequestDto;
import com.quispe.food_delivery.auth.mapper.AuthMapper;
import com.quispe.food_delivery.common.exception.BusinessException;
import com.quispe.food_delivery.common.exception.ResourceNotFoundException;
import com.quispe.food_delivery.security.JwtService;
import com.quispe.food_delivery.user.UserRepository;
import com.quispe.food_delivery.user.dto.UserResponseDto;
import com.quispe.food_delivery.user.entity.Role;
import com.quispe.food_delivery.user.entity.User;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthMapper authMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public UserResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("E-mail já cadastrado no sistema.");
        }

        User user = authMapper.toUserEntity(request);
        user.setRole(Role.CUSTOMER);
        user.setPassword(passwordEncoder.encode(request.password()));

        User savedUser = userRepository.save(user);
        return authMapper.toUserResponse(savedUser);
    }

    @Transactional(readOnly = true)
    public LoginResponseDto login(LoginRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com e-mail: " + request.email()));

        String token = jwtService.generateToken(user);
        return authMapper.toLoginResponse(user, token);
    }
}
