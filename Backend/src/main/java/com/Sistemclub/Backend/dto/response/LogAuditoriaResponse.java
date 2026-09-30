package com.Sistemclub.Backend.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LogAuditoriaResponse {

    private Long id;
    private String acao;
    private String entidade;
    private Long entidadeId;
    private String detalhes;
    private String ipOrigem;
    private LocalDateTime dataHora;

    // Dados do utilizador (opcional)
    private Long membroId;
    private String membroNome;
    private String membroEmail;
}