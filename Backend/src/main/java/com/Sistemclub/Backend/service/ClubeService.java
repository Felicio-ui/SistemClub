package com.Sistemclub.Backend.service;

import com.Sistemclub.Backend.dto.request.ClubeRequest;
import com.Sistemclub.Backend.dto.response.ClubeResponse;
import com.Sistemclub.Backend.entity.Clube;
import com.Sistemclub.Backend.exception.BusinessRuleException;
import com.Sistemclub.Backend.exception.ResourceNotFoundException;
import com.Sistemclub.Backend.mapper.ClubeMapper;
import com.Sistemclub.Backend.repository.ClubeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClubeService {

    private final ClubeRepository clubeRepository;
    private final ClubeMapper clubeMapper;

    @Transactional(readOnly = true)
    public List<ClubeResponse> listar() {
        return clubeMapper.toResponseList(clubeRepository.findAll());
    }

    @Transactional(readOnly = true)
    public List<ClubeResponse> listarPorEstado(String estado) {
        return clubeMapper.toResponseList(clubeRepository.findByEstado(estado));
    }

    @Transactional(readOnly = true)
    public ClubeResponse buscarPorId(Long id) {
        Clube clube = clubeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clube não encontrado: " + id));
        return clubeMapper.toResponse(clube);
    }

    @Transactional
    public ClubeResponse criar(ClubeRequest request) {
        if (clubeRepository.existsBySigla(request.getSigla())) {
            throw new BusinessRuleException("Já existe um clube com esta sigla.");
        }

        Clube clube = clubeMapper.toEntity(request);
        Clube guardado = clubeRepository.save(clube);
        return clubeMapper.toResponse(guardado);
    }

    @Transactional
    public ClubeResponse atualizar(Long id, ClubeRequest request) {
        Clube clube = clubeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clube não encontrado"));

        if (!clube.getSigla().equals(request.getSigla())
                && clubeRepository.existsBySigla(request.getSigla())) {
            throw new BusinessRuleException("Já existe um clube com esta sigla.");
        }

        clubeMapper.updateEntity(request, clube);
        Clube atualizado = clubeRepository.save(clube);
        return clubeMapper.toResponse(atualizado);
    }

    @Transactional
    public ClubeResponse alterarEstado(Long id, String novoEstado) {
        Clube clube = clubeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clube não encontrado"));

        if (!novoEstado.equals("Ativo") && !novoEstado.equals("Inativo")) {
            throw new BusinessRuleException("Estado inválido. Use 'Ativo' ou 'Inativo'.");
        }

        clube.setEstado(novoEstado);
        Clube atualizado = clubeRepository.save(clube);
        return clubeMapper.toResponse(atualizado);
    }

    @Transactional
    public void apagar(Long id) {
        if (!clubeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Clube não encontrado");
        }
        clubeRepository.deleteById(id);
    }
}