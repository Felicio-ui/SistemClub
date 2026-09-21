package com.Sistemclub.Backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    // ===== Gerar token =====
    public String gerarToken(String email, String perfil) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("perfil", perfil);

        return Jwts.builder()
                .claims(claims)
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    // ===== Extrair email =====
    public String extrairEmail(String token) {
        return extrairClaim(token, Claims::getSubject);
    }

    // ===== Extrair perfil =====
    public String extrairPerfil(String token) {
        return extrairClaim(token, claims -> claims.get("perfil", String.class));
    }

    // ===== Extrair expiração =====
    public Date extrairExpiracao(String token) {
        return extrairClaim(token, Claims::getExpiration);
    }

    // ===== Validar token =====
    public boolean validarToken(String token, String email) {
        try {
            String emailDoToken = extrairEmail(token);
            return emailDoToken.equals(email) && !tokenExpirado(token);
        } catch (Exception e) {
            return false;
        }
    }

    // ===== Verificar expiração =====
    private boolean tokenExpirado(String token) {
        return extrairExpiracao(token).before(new Date());
    }

    // ===== Extrair claim genérico =====
    private <T> T extrairClaim(String token, Function<Claims, T> resolver) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return resolver.apply(claims);
    }

    // ===== Chave de assinatura =====
    private SecretKey getSigningKey() {
        byte[] bytes = Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(secret.getBytes())
        );
        return Keys.hmacShaKeyFor(bytes);
    }
}