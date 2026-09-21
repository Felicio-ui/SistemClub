package com.Sistemclub.Backend.service;

import com.Sistemclub.Backend.dto.request.LoginRequest;
import com.Sistemclub.Backend.dto.response.JwtResponse;
import com.Sistemclub.Backend.entity.UsuarioPlataforma;
import com.Sistemclub.Backend.exception.InvalidCredentialsException;
import com.Sistemclub.Backend.repository.UsuarioPlataformaRepository;
import com.Sistemclub.Backend.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioPlataformaRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Transactional(readOnly = true)
    public JwtResponse login(LoginRequest request) {
        UsuarioPlataforma usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Email ou senha incorretos"));

        if (!passwordEncoder.matches(request.getSenha(), usuario.getSenha())) {
            throw new InvalidCredentialsException("Email ou senha incorretos");
        }

        if (!"Ativo".equals(usuario.getEstado())) {
            throw new InvalidCredentialsException("Conta inativa ou suspensa");
        }

        String token = jwtUtils.gerarToken(usuario.getEmail(), "ADMIN");

        return JwtResponse.builder()
                .token(token)
                .tipo("Bearer")
                .email(usuario.getEmail())
                .perfil("ADMIN")
                .nome(usuario.getNome() + " " + (usuario.getApelido() != null ? usuario.getApelido() : ""))
                .build();
    }
}