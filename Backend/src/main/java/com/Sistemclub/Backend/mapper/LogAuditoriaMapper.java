package com.Sistemclub.Backend.mapper;

import com.Sistemclub.Backend.dto.response.LogAuditoriaResponse;
import com.Sistemclub.Backend.entity.LogAuditoria;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LogAuditoriaMapper {

    @Mapping(target = "membroId", source = "membro.id")
    @Mapping(target = "membroNome", expression = "java(log.getMembro() != null ? log.getMembro().getNome() + \" \" + log.getMembro().getApelido() : null)")
    @Mapping(target = "membroEmail", source = "membro.email")
    LogAuditoriaResponse toResponse(LogAuditoria log);

    List<LogAuditoriaResponse> toResponseList(List<LogAuditoria> logs);
}
