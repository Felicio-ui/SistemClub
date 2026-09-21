package com.Sistemclub.Backend.service;

import com.Sistemclub.Backend.dto.request.UsuarioPlataformaRequest;
import com.Sistemclub.Backend.dto.response.UsuarioPlataformaResponse;
import com.Sistemclub.Backend.entity.UsuarioPlataforma;
import com.Sistemclub.Backend.exception.BusinessRuleException;
import com.Sistemclub.Backend.exception.ResourceNotFoundException;
import com.Sistemclub.Backend.mapper.UsuarioPlataformaMapper;
import com.Sistemclub.Backend.repository.UsuarioPlataformaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioPlataformaService {

    private final UsuarioPlataformaRepository repository;
    private final UsuarioPlataformaMapper mapper;

    @Transactional(readOnly = true)
    public List<UsuarioPlataformaResponse> listar() {
        return mapper.toResponseList(repository.findAll());
    }

    @Transactional(readOnly = true)
    public UsuarioPlataformaResponse buscarPorId(Long id) {
        UsuarioPlataforma usuario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado: " + id));
        return mapper.toResponse(usuario);
    }

    @Transactional
    public UsuarioPlataformaResponse criar(UsuarioPlataformaRequest request) {
        if (repository.existsByEmail(request.getEmail())) {
            throw new BusinessRuleException("Já existe um administrador com este email.");
        }

        UsuarioPlataforma usuario = mapper.toEntity(request);

        // Senha temporária (mais tarde será com BCrypt)
        usuario.setSenha("{noop}" + request.getSenha());

        UsuarioPlataforma guardado = repository.save(usuario);
        return mapper.toResponse(guardado);
    }

    @Transactional
    public UsuarioPlataformaResponse atualizar(Long id, UsuarioPlataformaRequest request) {
        UsuarioPlataforma usuario = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Administrador não encontrado"));

        if (!usuario.getEmail().equals(request.getEmail())
                && repository.existsByEmail(request.getEmail())) {
            throw new BusinessRuleException("Já existe um administrador com este email.");
        }

        mapper.updateEntity(request, usuario);
        UsuarioPlataforma atualizado = repository.save(usuario);
        return mapper.toResponse(atualizado);
    }

    @Transactional
    public void apagar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Administrador não encontrado");
        }
        repository.deleteById(id);
    }
}