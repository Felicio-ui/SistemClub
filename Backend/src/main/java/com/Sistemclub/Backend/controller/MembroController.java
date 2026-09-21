package com.Sistemclub.Backend.controller;

import com.Sistemclub.Backend.dto.request.MembroRequest;
import com.Sistemclub.Backend.dto.response.MembroResponse;
import com.Sistemclub.Backend.service.MembroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/membros")
@RequiredArgsConstructor
public class MembroController {

    private final MembroService membroService;

    // GET /api/membros            → todos os membros
    // GET /api/membros?clubeId=1  → membros do clube 1
    @GetMapping
    public ResponseEntity<List<MembroResponse>> listar(
            @RequestParam(required = false) Long clubeId) {
        if (clubeId != null) {
            return ResponseEntity.ok(membroService.listarPorClube(clubeId));
        }
        return ResponseEntity.ok(membroService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MembroResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(membroService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<MembroResponse> criar(
            @RequestParam Long clubeId,
            @Valid @RequestBody MembroRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(membroService.criar(clubeId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MembroResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody MembroRequest request) {
        return ResponseEntity.ok(membroService.atualizar(id, request));
    }

    // PATCH /api/membros/5/estado?valor=Ativo
    @PatchMapping("/{id}/estado")
    public ResponseEntity<MembroResponse> alterarEstado(
            @PathVariable Long id,
            @RequestParam String valor) {
        return ResponseEntity.ok(membroService.alterarEstado(id, valor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagar(@PathVariable Long id) {
        membroService.apagar(id);
        return ResponseEntity.noContent().build();
    }
}