package com.Sistemclub.Backend.repository;

import com.Sistemclub.Backend.entity.LogAuditoria;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LogAuditoriaRepository extends JpaRepository<LogAuditoria, Long> {

    // Últimos N logs (ordenados)
    List<LogAuditoria> findTop100ByOrderByDataHoraDesc();

    // Filtrar por ação
    List<LogAuditoria> findByAcaoOrderByDataHoraDesc(String acao);

    // Filtrar por membro
    List<LogAuditoria> findByMembroIdOrderByDataHoraDesc(Long membroId);

    // Filtrar por intervalo de datas
    List<LogAuditoria> findByDataHoraBetweenOrderByDataHoraDesc(
            LocalDateTime inicio, LocalDateTime fim);

    // Paginado (para listas grandes)
    Page<LogAuditoria> findAllByOrderByDataHoraDesc(Pageable pageable);
}