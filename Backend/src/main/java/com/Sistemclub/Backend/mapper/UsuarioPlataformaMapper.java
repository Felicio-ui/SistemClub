package com.Sistemclub.Backend.mapper;

import com.Sistemclub.Backend.dto.request.UsuarioPlataformaRequest;
import com.Sistemclub.Backend.dto.response.UsuarioPlataformaResponse;
import com.Sistemclub.Backend.entity.UsuarioPlataforma;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UsuarioPlataformaMapper {

    UsuarioPlataformaResponse toResponse(UsuarioPlataforma usuario);

    List<UsuarioPlataformaResponse> toResponseList(List<UsuarioPlataforma> usuarios);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    @Mapping(target = "estado", ignore = true)
    UsuarioPlataforma toEntity(UsuarioPlataformaRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    @Mapping(target = "senha", ignore = true)
    void updateEntity(UsuarioPlataformaRequest request, @MappingTarget UsuarioPlataforma usuario);
}