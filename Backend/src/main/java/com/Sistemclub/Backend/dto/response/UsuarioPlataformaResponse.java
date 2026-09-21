package com.Sistemclub.Backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioPlataformaResponse {

    private Long id;
    private String nome;
    private String apelido;
    private String email;
    private String estado;
    private LocalDateTime criadoEm;
}