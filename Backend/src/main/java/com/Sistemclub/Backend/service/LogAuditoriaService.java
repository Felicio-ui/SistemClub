package com.Sistemclub.Backend.service;

import com.Sistemclub.Backend.dto.response.LogAuditoriaResponse;
import com.Sistemclub.Backend.entity.LogAuditoria;
import com.Sistemclub.Backend.mapper.LogAuditoriaMapper;
import com.Sistemclub.Backend.repository.LogAuditoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogAuditoriaService {

    private final LogAuditoriaRepository logRepository;
    private final LogAuditoriaMapper logMapper;

    @Transactional(readOnly = true)
    public List<LogAuditoriaResponse> listarRecentes() {
        return logMapper.toResponseList(logRepository.findTop100ByOrderByDataHoraDesc());
    }

    @Transactional(readOnly = true)
    public List<LogAuditoriaResponse> listarPorAcao(String acao) {
        return logMapper.toResponseList(logRepository.findByAcaoOrderByDataHoraDesc(acao));
    }

    @Transactional(readOnly = true)
    public List<LogAuditoriaResponse> listarPorMembro(Long membroId) {
        return logMapper.toResponseList(logRepository.findByMembroIdOrderByDataHoraDesc(membroId));
    }

    @Transactional(readOnly = true)
    public List<LogAuditoriaResponse> listarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return logMapper.toResponseList(
                logRepository.findByDataHoraBetweenOrderByDataHoraDesc(inicio, fim));
    }

    // Método interno para registar logs (será usado por outros services)
    @Transactional
    public void registar(String acao, String entidade, Long entidadeId, String detalhes) {
        LogAuditoria log = LogAuditoria.builder()
                .acao(acao)
                .entidade(entidade)
                .entidadeId(entidadeId)
                .detalhes(detalhes)
                .dataHora(LocalDateTime.now())
                .build();

        logRepository.save(log);
    }
}