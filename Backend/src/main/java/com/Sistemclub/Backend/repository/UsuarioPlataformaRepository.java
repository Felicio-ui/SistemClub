package com.Sistemclub.Backend.repository;

import com.Sistemclub.Backend.entity.UsuarioPlataforma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioPlataformaRepository extends JpaRepository<UsuarioPlataforma, Long> {

    Optional<UsuarioPlataforma> findByEmail(String email);

    boolean existsByEmail(String email);

    List<UsuarioPlataforma> findByEstado(String estado);
}