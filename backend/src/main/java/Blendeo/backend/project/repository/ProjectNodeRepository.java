package Blendeo.backend.project.repository;

import Blendeo.backend.project.dto.ProjectHierarchyRes;
import Blendeo.backend.project.dto.ProjectNodeLink;
import Blendeo.backend.project.entity.Project;
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

    @Query("""
        MATCH (current:ProjectNode {projectId: $currentProjectId})
        OPTIONAL MATCH (current)-[:FORK]->(parent:ProjectNode)
        OPTIONAL MATCH (sibling:ProjectNode)-[:FORK]->(parent)
        WHERE sibling.projectId > $currentProjectId
        RETURN sibling
        ORDER BY sibling.projectId
        LIMIT 1
    """)
    Optional<ProjectNode> findNextSibling(@Param("currentProjectId") Long currentProjectId);

    // 이전 프로젝트 찾기
    @Query("""
        MATCH (current:ProjectNode {projectId: $currentProjectId})
        MATCH (current)-[:FORK]->(parent:ProjectNode)
        MATCH (sibling:ProjectNode)-[:FORK]->(parent)
        WHERE sibling.projectId < $currentProjectId
        RETURN sibling
        ORDER BY sibling.projectId DESC
        LIMIT 1
    """)
    Optional<ProjectNode> findPreviousSibling(@Param("currentProjectId") Long currentProjectId);

    // 같은 부모를 가진 첫 번째 프로젝트 찾기
    @Query("""
        MATCH (current:ProjectNode {projectId: $currentProjectId})
        MATCH (current)-[:FORK]->(parent:ProjectNode)
        MATCH (sibling:ProjectNode)-[:FORK]->(parent)
        RETURN sibling
        ORDER BY sibling.projectId
        LIMIT 1
    """)
    Optional<ProjectNode> findFirstSibling(@Param("currentProjectId") Long currentProjectId);

    // 같은 부모를 가진 마지막 프로젝트 찾기
    @Query("""
        MATCH (current:ProjectNode {projectId: $currentProjectId})
        MATCH (current)-[:FORK]->(parent:ProjectNode)
        MATCH (sibling:ProjectNode)-[:FORK]->(parent)
        RETURN sibling
        ORDER BY sibling.projectId DESC
        LIMIT 1
    """)
    Optional<ProjectNode> findLastSibling(@Param("currentProjectId") Long currentProjectId);
//
    @Query("""
            MATCH path = (n)-[*]-(connected)
           WHERE n.projectId = $projectId
           WITH COLLECT(DISTINCT n) + COLLECT(DISTINCT connected) as allNodes,
                COLLECT(relationships(path)) as allRels
           UNWIND allNodes as node
           WITH COLLECT(DISTINCT {
               id: COALESCE(node.projectId, 0)
           }) as nodes,
           CASE
               WHEN size(allRels) > 0
               THEN REDUCE(s = [], rel IN REDUCE(s = [], path IN allRels | s + path) |
                   s + {
                       source: COALESCE(startNode(rel).projectId, 0),
                       target: COALESCE(endNode(rel).projectId, 0)
                   }
               )
               ELSE []
           END as links
           RETURN nodes, links
    """)
    ProjectNodeLink getProjectHierarchy(@Param("projectId") Long projectId);

    @Query("""
        MATCH path = (child:ProjectNode {projectId: $projectId})-[:FORK*]->(parent:ProjectNode)
        RETURN DISTINCT parent
    """)
    List<ProjectNode> getContributorInfo(@Param("projectId") long projectId);

    @Query("""
            MATCH (current:ProjectNode {projectId: $projectId})
            MATCH (current)-[:FORK]->(parent:ProjectNode)
            RETURN parent
            LIMIT 1
            """)
    ProjectNode getParentInfo(@Param("projectId") long projectId);

    @Query("""
            MATCH (parent:ProjectNode {projectId: $projectId})
            MATCH (child:ProjectNode)-[:FORK]->(parent)
            RETURN child
            ORDER BY child.projectId
            """)
    List<ProjectNode> getChildrenInfo(@Param("projectId") long projectId);

//    @Query("""
//        MATCH path = (n)-[*]-(connected)
//        WHERE n.projectId = $projectId
//        WITH COLLECT(DISTINCT n) + COLLECT(DISTINCT connected) as allNodes,
//             COLLECT(relationships(path)) as allRels
//        UNWIND allNodes as node
//        WITH COLLECT(DISTINCT {
//            id: toInteger(COALESCE(node.projectId, 0))  // Long으로 변환
//        }) as nodes,
//        CASE
//            WHEN size(allRels) > 0
//            THEN REDUCE(s = [], rel IN REDUCE(s = [], path IN allRels | s + path) |
//                s + {
//                    source: toInteger(COALESCE(startNode(rel).projectId, 0)),  // Long으로 변환
//                    target: toInteger(COALESCE(endNode(rel).projectId, 0))     // Long으로 변환
//                }
//            )
//            ELSE []
//        END as links
//        RETURN nodes, links
//        """)
//    ProjectNodeLink getProjectHierarchy(@Param("projectId") Long projectId);

}