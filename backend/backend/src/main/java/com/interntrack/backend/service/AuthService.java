package com.interntrack.backend.service;

import com.interntrack.backend.dto.request.LoginRequest;
import com.interntrack.backend.dto.request.RegisterRequest;
import com.interntrack.backend.dto.response.AuthResponse;
import com.interntrack.backend.model.User;
import com.interntrack.backend.repository.UserRepository;
import com.interntrack.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse("Email already registered", null);
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        return new AuthResponse("Registration successful", null);
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return new AuthResponse("User not found", null);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse("Invalid password", null);
        }

        String token = jwtService.generateToken(user.getEmail());

        return new AuthResponse("Login successful", token);
    }
}