package com.Sistemclub.Backend.controller;

import com.Sistemclub.Backend.dto.request.ClubeRequest;
import com.Sistemclub.Backend.dto.response.ClubeResponse;
import com.Sistemclub.Backend.service.ClubeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clubes")
@RequiredArgsConstructor
public class ClubeController {

    private final ClubeService clubeService;

    // GET /api/clubes                  → todos
    // GET /api/clubes?estado=Ativo     → filtrados por estado
    @GetMapping
    public ResponseEntity<List<ClubeResponse>> listar(
            @RequestParam(required = false) String estado) {
        if (estado != null) {
            return ResponseEntity.ok(clubeService.listarPorEstado(estado));
        }
        return ResponseEntity.ok(clubeService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClubeResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(clubeService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ClubeResponse> criar(@Valid @RequestBody ClubeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clubeService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClubeResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClubeRequest request) {
        return ResponseEntity.ok(clubeService.atualizar(id, request));
    }

    // PATCH /api/clubes/5/estado?valor=Inativo
    @PatchMapping("/{id}/estado")
    public ResponseEntity<ClubeResponse> alterarEstado(
            @PathVariable Long id,
            @RequestParam String valor) {
        return ResponseEntity.ok(clubeService.alterarEstado(id, valor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagar(@PathVariable Long id) {
        clubeService.apagar(id);
        return ResponseEntity.noContent().build();
    }
}