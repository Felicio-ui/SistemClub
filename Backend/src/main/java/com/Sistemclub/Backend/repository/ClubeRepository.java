package com.Sistemclub.Backend.repository;

import com.Sistemclub.Backend.entity.Clube;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubeRepository extends JpaRepository<Clube, Long> {

    Optional<Clube> findBySigla(String sigla);

    boolean existsBySigla(String sigla);

    List<Clube> findByEstado(String estado);

    long countByEstado(String estado);
}