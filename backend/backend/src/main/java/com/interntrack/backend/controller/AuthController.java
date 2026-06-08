package com.interntrack.backend.controller;

import com.interntrack.backend.dto.request.LoginRequest;
import com.interntrack.backend.dto.request.RegisterRequest;
import com.interntrack.backend.dto.response.AuthResponse;
import com.interntrack.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}