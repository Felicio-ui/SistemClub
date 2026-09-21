package com.Sistemclub.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "membro")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Membro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ===== Relacionamento com Clube =====
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clube_id", nullable = false)
    private Clube clube;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(nullable = false, length = 100)
    private String apelido;

    @Column(length = 15)
    private String sexo;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 50)
    private String nacionalidade;

    @Column(nullable = false, length = 30)
    private String documento;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(nullable = false, length = 255)
    private String senha;

    @Column(columnDefinition = "TEXT")
    private String endereco;

    @Column(length = 255)
    private String foto;

    @Column(name = "data_adesao", nullable = false)
    private LocalDate dataAdesao;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    public void prePersist() {
        if (criadoEm == null) criadoEm = LocalDateTime.now();
        if (dataAdesao == null) dataAdesao = LocalDate.now();
        if (estado == null) estado = "Ativo";
    }
}