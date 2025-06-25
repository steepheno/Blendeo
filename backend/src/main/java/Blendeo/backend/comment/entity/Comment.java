package Blendeo.backend.comment.entity;

import Blendeo.backend.global.entity.BaseTimeEntity;
import Blendeo.backend.project.entity.Project;
import Blendeo.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

@ToString
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Comment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String comment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Builder
    public Comment(String comment, User user, Project project) {
        this.comment = comment;
        this.user = user;
        this.project = project;
    }
}
