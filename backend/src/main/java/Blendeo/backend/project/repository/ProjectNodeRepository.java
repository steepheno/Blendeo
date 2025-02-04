package Blendeo.backend.project.repository;

import Blendeo.backend.project.dto.ProjectHierarchyRes;
import Blendeo.backend.project.entity.ProjectNode;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.ReactiveNeo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectNodeRepository extends Neo4jRepository<ProjectNode, Long> {
    @Query("MATCH (p:ProjectNode) WHERE p.projectId = $projectId RETURN p")
    Optional<ProjectNode> findByProjectId(@Param("projectId") Long projectId);

    @Query("CREATE (p:ProjectNode) SET p.projectId = $node.projectId")
    void createNode(@Param("node") ProjectNode projectNode);

    @Query("MATCH (p:ProjectNode {projectId: $projectId}) " +
            "WHERE NOT (p)<-[:FORK]-() " +  // fork 관계가 없는 경우만
            "DETACH DELETE p")
    void deleteByProjectIdIfNotForked(@Param("projectId") Long projectId);


    // fork 관계 추가
    @Query("MATCH (child:ProjectNode {projectId: $childId}), (parent:ProjectNode {projectId: $parentId}) " +
            "CREATE (child)-[:FORK]->(parent)")
    void createForkRelation(@Param("childId") Long childId, @Param("parentId") Long parentId);

    @Query("MATCH (start:ProjectNode {projectId: $projectId})-[:FORK*0..]->(connected) " +
            "WITH connected " +
            "OPTIONAL MATCH (connected)<-[:FORK]-(child) " +
            "WITH connected, COLLECT({projectId: child.projectId, children: []}) as children " +
            "RETURN {projectId: connected.projectId, children: children} as result")
    Optional<List<Map<String, Object>>> getProjectHierarchy(@Param("projectId") Long projectId);
}