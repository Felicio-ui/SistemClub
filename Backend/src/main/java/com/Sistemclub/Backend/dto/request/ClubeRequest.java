package com.Sistemclub.Backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubeRequest {

    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 2, max = 150)
    private String nome;

    @NotBlank(message = "A sigla é obrigatória")
    @Size(min = 2, max = 20)
    private String sigla;

    private LocalDate dataFundacao;

    private String endereco;

    @Size(max = 30)
    private String telefone;

    @Email(message = "Email inválido")
    private String email;

    private String logotipo;
}