package com.Sistemclub.Backend.mapper;

import com.Sistemclub.Backend.dto.request.MembroRequest;
import com.Sistemclub.Backend.dto.response.MembroResponse;
import com.Sistemclub.Backend.entity.Membro;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface MembroMapper {

    @Mapping(target = "clubeId", source = "clube.id")
    @Mapping(target = "clubeNome", source = "clube.nome")
    MembroResponse toResponse(Membro membro);

    List<MembroResponse> toResponseList(List<Membro> membros);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "clube", ignore = true)
    @Mapping(target = "dataAdesao", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    @Mapping(target = "senha", ignore = true)
    Membro toEntity(MembroRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "clube", ignore = true)
    @Mapping(target = "dataAdesao", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    @Mapping(target = "senha", ignore = true)
    void updateEntity(MembroRequest request, @MappingTarget Membro membro);
}