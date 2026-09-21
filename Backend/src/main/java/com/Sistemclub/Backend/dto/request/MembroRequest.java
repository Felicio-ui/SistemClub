package com.Sistemclub.Backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembroRequest {

    @NotBlank(message = "O nome é obrigatório")
    @Size(min = 2, max = 100)
    private String nome;

    @NotBlank(message = "O apelido é obrigatório")
    @Size(min = 2, max = 100)
    private String apelido;

    @Pattern(regexp = "Masculino|Feminino", message = "Sexo deve ser Masculino ou Feminino")
    private String sexo;

    private LocalDate dataNascimento;

    @Size(max = 50)
    private String nacionalidade;

    @NotBlank(message = "O documento (BI/NIF) é obrigatório")
    @Size(min = 5, max = 30)
    private String documento;

    @NotBlank(message = "O email é obrigatório")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "A senha é obrigatória")
    @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres")
    private String senha;

    private String endereco;

    private String foto;
}