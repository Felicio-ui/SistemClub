package com.Sistemclub.Backend.controller;

import com.Sistemclub.Backend.dto.response.LogAuditoriaResponse;
import com.Sistemclub.Backend.service.LogAuditoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogAuditoriaController {

    private final LogAuditoriaService logService;

    // GET /api/logs
    // GET /api/logs?acao=LOGIN
    // GET /api/logs?membroId=1
    // GET /api/logs?inicio=2026-01-01T00:00:00&fim=2026-12-31T23:59:59
    @GetMapping
    public ResponseEntity<List<LogAuditoriaResponse>> listar(
            @RequestParam(required = false) String acao,
            @RequestParam(required = false) Long membroId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {

        if (acao != null) {
            return ResponseEntity.ok(logService.listarPorAcao(acao));
        }

        if (membroId != null) {
            return ResponseEntity.ok(logService.listarPorMembro(membroId));
        }

        if (inicio != null && fim != null) {
            return ResponseEntity.ok(logService.listarPorPeriodo(inicio, fim));
        }

        return ResponseEntity.ok(logService.listarRecentes());
    }
}