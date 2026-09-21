package com.Sistemclub.Backend.controller;

import com.Sistemclub.Backend.dto.request.UsuarioPlataformaRequest;
import com.Sistemclub.Backend.dto.response.UsuarioPlataformaResponse;
import com.Sistemclub.Backend.service.UsuarioPlataformaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admins")
@RequiredArgsConstructor
public class UsuarioPlataformaController {

    private final UsuarioPlataformaService service;

    @GetMapping
    public ResponseEntity<List<UsuarioPlataformaResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioPlataformaResponse> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<UsuarioPlataformaResponse> criar(
            @Valid @RequestBody UsuarioPlataformaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioPlataformaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioPlataformaRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> apagar(@PathVariable Long id) {
        service.apagar(id);
        return ResponseEntity.noContent().build();
    }
}