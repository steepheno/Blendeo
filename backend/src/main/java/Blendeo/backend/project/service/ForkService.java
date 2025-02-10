package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.project.dto.ProjectHierarchyRes;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.repository.ProjectNodeRepository;
import Blendeo.backend.project.repository.ProjectRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ForkService {
    private final ProjectNodeRepository projectNodeRepository;
    private final ProjectRepository projectRepository;

    public List<ProjectHierarchyRes> getHierarchy(Long projectId) {
        List<Map<String, Object>> hierarchyResults = projectNodeRepository.getProjectHierarchy(projectId)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage()));

        Set<Long> projectIdSet = new HashSet<>();
        collectProjectIds(hierarchyResults, projectIdSet);

        List<Long> projectIds = new ArrayList<>(projectIdSet);

        List<Project> projects = projectRepository.findAllByIdIn(projectIds);

        Map<Long, Project> projectMap = new HashMap<>();
        for (Project project : projects) {
            projectMap.put(project.getId(), project);
        }

        return hierarchyResults.stream()
                .map(result -> mapToProjectHierarchy(result, projectMap))
                .collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private ProjectHierarchyRes mapToProjectHierarchy(Map<String, Object> map, Map<Long, Project> projectMap) {

        Long projectId = ((Number) map.get("projectId")).longValue();
        Project project = projectMap.get(projectId);

        if (project == null) {
            throw new EntityNotFoundException(ErrorCode.PROJECT_NOT_FOUND, ErrorCode.PROJECT_NOT_FOUND.getMessage());
        }

        List<Map<String, Object>> childrenMaps = (List<Map<String, Object>>) map.get("children");
        List<ProjectHierarchyRes> children = childrenMaps != null ?
                childrenMaps.stream()
                        .map(childMap -> mapToProjectHierarchy(childMap, projectMap))
                        .collect(Collectors.toList()) :
                new ArrayList<>();

        return ProjectHierarchyRes.builder()
                .id(project.getId())
                .title(project.getTitle())
                .thumbnail(project.getThumbnail())
                .authorNickname(project.getAuthor().getNickname())
                .viewCnt(project.getViewCnt())
                .children(children)
                .build();
    }

    @SuppressWarnings("unchecked")
    private void collectProjectIds(List<Map<String, Object>> results, Set<Long> ids) {
        for (Map<String, Object> result : results) {
            ids.add(((Number) result.get("projectId")).longValue());
            List<Map<String, Object>> children = (List<Map<String, Object>>) result.get("children");
            if (children != null && !children.isEmpty()) {
                collectProjectIds(children, ids);
            }
        }
    }
}