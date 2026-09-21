package com.Sistemclub.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "clube")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clube {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 20)
    private String sigla;

    @Column(name = "data_fundacao")
    private LocalDate dataFundacao;

    @Column(columnDefinition = "TEXT")
    private String endereco;

    @Column(length = 30)
    private String telefone;

    @Column(length = 100)
    private String email;

    @Column(length = 255)
    private String logotipo;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        if (criadoEm == null) criadoEm = LocalDateTime.now();
        if (estado == null) estado = "Ativo";
    }
}