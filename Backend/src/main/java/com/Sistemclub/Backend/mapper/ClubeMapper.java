package com.Sistemclub.Backend.mapper;

import com.Sistemclub.Backend.dto.request.ClubeRequest;
import com.Sistemclub.Backend.dto.response.ClubeResponse;
import com.Sistemclub.Backend.entity.Clube;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClubeMapper {

    ClubeResponse toResponse(Clube clube);

    List<ClubeResponse> toResponseList(List<Clube> clubes);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    Clube toEntity(ClubeRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    void updateEntity(ClubeRequest request, @MappingTarget Clube clube);
}
