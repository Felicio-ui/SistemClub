package com.Sistemclub.Backend.service;

import com.Sistemclub.Backend.dto.request.MembroRequest;
import com.Sistemclub.Backend.dto.response.MembroResponse;
import com.Sistemclub.Backend.entity.Clube;
import com.Sistemclub.Backend.entity.Membro;
import com.Sistemclub.Backend.exception.BusinessRuleException;
import com.Sistemclub.Backend.exception.ResourceNotFoundException;
import com.Sistemclub.Backend.mapper.MembroMapper;
import com.Sistemclub.Backend.repository.ClubeRepository;
import com.Sistemclub.Backend.repository.MembroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MembroService {

    private final MembroRepository membroRepository;
    private final ClubeRepository clubeRepository;
    private final MembroMapper membroMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<MembroResponse> listarPorClube(Long clubeId) {
        return membroMapper.toResponseList(membroRepository.findByClubeId(clubeId));
    }

    @Transactional(readOnly = true)
    public List<MembroResponse> listar() {
        return membroMapper.toResponseList(membroRepository.findAll());
    }

    @Transactional(readOnly = true)
    public MembroResponse buscarPorId(Long id) {
        Membro membro = membroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado: " + id));
        return membroMapper.toResponse(membro);
    }

    @Transactional
    public MembroResponse criar(Long clubeId, MembroRequest request) {
        Clube clube = clubeRepository.findById(clubeId)
                .orElseThrow(() -> new ResourceNotFoundException("Clube não encontrado: " + clubeId));

        if (membroRepository.existsByClubeIdAndEmail(clubeId, request.getEmail())) {
            throw new BusinessRuleException("Já existe um membro com este email neste clube.");
        }

        if (membroRepository.existsByClubeIdAndDocumento(clubeId, request.getDocumento())) {
            throw new BusinessRuleException("Já existe um membro com este documento neste clube.");
        }

        Membro membro = membroMapper.toEntity(request);
        membro.setClube(clube);
        membro.setSenha(passwordEncoder.encode(request.getSenha()));

        Membro guardado = membroRepository.save(membro);
        return membroMapper.toResponse(guardado);
    }

    @Transactional
    public MembroResponse atualizar(Long id, MembroRequest request) {
        Membro membro = membroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado"));

        membroMapper.updateEntity(request, membro);
        Membro atualizado = membroRepository.save(membro);
        return membroMapper.toResponse(atualizado);
    }

    @Transactional
    public MembroResponse alterarEstado(Long id, String novoEstado) {
        Membro membro = membroRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado"));

        membro.setEstado(novoEstado);
        Membro atualizado = membroRepository.save(membro);
        return membroMapper.toResponse(atualizado);
    }

    @Transactional
    public void apagar(Long id) {
        if (!membroRepository.existsById(id)) {
            throw new ResourceNotFoundException("Membro não encontrado");
        }
        membroRepository.deleteById(id);
    }
}