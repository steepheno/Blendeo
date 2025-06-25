package Blendeo.backend.project.dto;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Data
public class ProjectNodeLink {
    private List<Node> nodes = new ArrayList<>();
    private List<Link> links = new ArrayList<>();

    @Data
    public static class Node {
        private Long id;
    }

    @Data
    public static class Link {
        private Long source;
        private Long target;
    }
}
