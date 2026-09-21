package com.Sistemclub.Backend.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembroResponse {

    private Long id;
    private Long clubeId;
    private String clubeNome;
    private String nome;
    private String apelido;
    private String sexo;
    private LocalDate dataNascimento;
    private String nacionalidade;
    private String documento;
    private String email;
    private String endereco;
    private String foto;
    private LocalDate dataAdesao;
    private String estado;
    private LocalDateTime criadoEm;
}
