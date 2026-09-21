package com.Sistemclub.Backend.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {

    private String token;
    private String tipo;
    private String email;
    private String perfil;
    private String nome;
}