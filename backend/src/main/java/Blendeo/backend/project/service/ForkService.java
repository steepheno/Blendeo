package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.project.dto.ProjectHierarchyRes;
import Blendeo.backend.project.dto.ProjectHierarchyRes.ProjectNodeInfo;
import Blendeo.backend.project.dto.ProjectNodeLink;
import Blendeo.backend.project.dto.ProjectNodeLink.Node;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.repository.ProjectNodeRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ForkService {
    private final ProjectNodeRepository projectNodeRepository;
    private final ProjectRepository projectRepository;

    public ProjectHierarchyRes getHierarchy(Long projectId) {
        log.debug("Querying for projectId: {}", projectId);
        System.out.println(projectId);
        ProjectNodeLink result = projectNodeRepository.getProjectHierarchy(projectId);
        log.debug("result: {}", result);

        List<ProjectHierarchyRes.ProjectNodeInfo> nodes = result.getNodes().stream()
                .map(node -> projectRepository.findById(node.getId()))
                .flatMap(Optional::stream)
                .map(node -> ProjectHierarchyRes.ProjectNodeInfo.builder()
                        .projectId(node.getId())
                        .title(node.getTitle())
                        .thumbnail(node.getThumbnail())
                        .authorNickname(node.getAuthor().getNickname())
                        .viewCnt(node.getViewCnt())
                        .build())
                .collect(Collectors.toList());

        return ProjectHierarchyRes.builder()
                .nodes(nodes)
                .links(result.getLinks())
                .build();
    }
}
