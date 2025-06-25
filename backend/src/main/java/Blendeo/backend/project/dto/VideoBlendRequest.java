package Blendeo.backend.project.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VideoBlendRequest {

    private String forkedUrl;

    @NotNull(message = "비디오 파일은 필수입니다.")
    private MultipartFile videoFile;

    private double startPoint = 0.0;

    private double duration = 0.0;

    private int loopCnt = 1;
}