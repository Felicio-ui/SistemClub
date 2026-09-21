package com.Sistemclub.Backend.repository;

import com.Sistemclub.Backend.entity.Membro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MembroRepository extends JpaRepository<Membro, Long> {

    List<Membro> findByClubeId(Long clubeId);

    List<Membro> findByClubeIdAndEstado(Long clubeId, String estado);

    Optional<Membro> findByEmail(String email);

    Optional<Membro> findByClubeIdAndDocumento(Long clubeId, String documento);

    boolean existsByClubeIdAndEmail(Long clubeId, String email);

    boolean existsByClubeIdAndDocumento(Long clubeId, String documento);

    long countByClubeIdAndEstado(Long clubeId, String estado);
}