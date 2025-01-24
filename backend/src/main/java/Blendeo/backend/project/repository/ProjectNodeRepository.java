package Blendeo.backend.project.repository;

import Blendeo.backend.project.entity.ProjectNode;
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


    // fork 관계 추가
    @Query("MATCH (child:ProjectNode {projectId: $childId}), (parent:ProjectNode {projectId: $parentId}) " +
            "CREATE (child)-[:FORK]->(parent)")
    void createForkRelation(@Param("childId") Long childId, @Param("parentId") Long parentId);
}
