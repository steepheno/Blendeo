package Blendeo.backend.project.service;

import Blendeo.backend.exception.EntityNotFoundException;
import Blendeo.backend.global.error.ErrorCode;
import Blendeo.backend.project.dto.ProjectHierarchyDto;
import Blendeo.backend.project.dto.ProjectHierarchyRes;
import Blendeo.backend.project.dto.ProjectHierarchyRes.ProjectNodeInfo;
import Blendeo.backend.project.dto.ProjectHierarchyRes2;
import Blendeo.backend.project.dto.ProjectNodeLink;
import Blendeo.backend.project.dto.ProjectNodeLink.Node;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.project.repository.ProjectNodeRepository;
import Blendeo.backend.project.repository.ProjectRepository;

import java.util.*;
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

    public List<ProjectHierarchyDto> getHierarchy2(Long projectId) {
        return projectRepository.getHierarchy2(projectId)
                .stream()
                .map(project -> new ProjectHierarchyDto(
                        project.getId(),
                        project.getForkId(),
                        project.getTitle(),
                        project.getAuthor().getNickname()
                ))
                .collect(Collectors.toList());
    }

    public List<ProjectHierarchyRes> getAllNodes() {
        List<ProjectHierarchyRes> answer = new ArrayList<>();

        // 모든 프로젝트의 node index 조회(오름차순)
        List<Long> projectIds = projectRepository.getAllIds();

        boolean[] visited = new boolean[(int) (projectIds.get(projectIds.size() - 1) + 1)];

        for (int index=0; index < projectIds.size(); index++) {
            long current = projectIds.get(index);
            if (visited[(int) current]) {
                continue;
            }
            visited[(int) current] = true;

            ProjectNodeLink result = projectNodeRepository.getProjectHierarchy(current);

            if (result == null) {
                continue;
            }

            List<ProjectHierarchyRes.ProjectNodeInfo> nodes = result.getNodes().stream()
                    .map(node -> projectRepository.findById(node.getId()))
                    .flatMap(Optional::stream)
                    .map(node -> {
                        ProjectHierarchyRes.ProjectNodeInfo tmp = ProjectHierarchyRes.ProjectNodeInfo.builder()
                                .projectId(node.getId())
                                .title(node.getTitle())
                                .thumbnail(node.getThumbnail())
                                .authorNickname(node.getAuthor().getNickname())
                                .viewCnt(node.getViewCnt())
                                .build();

                        visited[Math.toIntExact(node.getId())] = true;
                        return tmp;
                    })
                    .collect(Collectors.toList());

            answer.add(
                    ProjectHierarchyRes.builder()
                        .nodes(nodes)
                        .links(result.getLinks())
                        .build()
            );
        }
        return answer;
    }
}
