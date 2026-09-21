package com.Sistemclub.Backend.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubeResponse {

    private Long id;
    private String nome;
    private String sigla;
    private LocalDate dataFundacao;
    private String endereco;
    private String telefone;
    private String email;
    private String logotipo;
    private String estado;
    private LocalDateTime criadoEm;
}