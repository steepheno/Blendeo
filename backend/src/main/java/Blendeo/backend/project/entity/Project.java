package Blendeo.backend.project.entity;

import Blendeo.backend.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.net.URL;
import java.time.LocalDateTime;

@ToString
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long forkId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String contents;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private int contributorCnt;

    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime createdAt;

    @Column(columnDefinition = "BOOLEAN DEFAULT true")
    private boolean state;

    private String thumbnail;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private int runningTime;

    @Column(columnDefinition = "INTEGER DEFAULT 0")
    private int viewCnt;

    private URL videoUrl;

    @Builder
    public Project(Long forkId, User author, String title, String contents,
                   String thumbnail, int contributorCnt, URL videoUrl, int runningTime) {
        this.forkId = forkId;
        this.author = author;
        this.title = title;
        this.contents = contents;
        this.thumbnail = thumbnail;
        this.videoUrl = videoUrl;
        this.contributorCnt = contributorCnt;
        this.createdAt = LocalDateTime.now();
        this.state = true;
        this.runningTime = runningTime;
        this.viewCnt = 0;
    }

    public void updateState(boolean state) {
        this.state = state;
    }

    public void updateContents(String contents) {
        this.contents = contents;
    }
}