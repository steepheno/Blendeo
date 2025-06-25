package Blendeo.backend.project.entity;

import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Property;
import org.springframework.data.neo4j.core.schema.Relationship;
import org.springframework.data.neo4j.core.schema.Relationship.Direction;

@Getter
@Node("ProjectNode")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProjectNode {
    @Id
    @Property("projectId")
    private Long projectId;

    @Relationship(type = "FORK", direction = Direction.OUTGOING)
    private ProjectNode parentProject;

    @Relationship(type = "FORK", direction = Direction.INCOMING)
    private Set<ProjectNode> forkedProjects = new HashSet<>();
}
