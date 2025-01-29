package Blendeo.backend.project.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import net.bramp.ffmpeg.FFprobe;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Component
@Getter
public class VideoInfo {
    @Value("${ffprobe.path}")
    public String ffprobePath;

    public class Info {
        public int width;
        public int height;
        Info(int width, int height) {
            this.width = width;
            this.height = height;
        }
    }

    public Info getVideoInfo(String videoPath) throws IOException {
        ProcessBuilder pb = new ProcessBuilder(
                ffprobePath,
                "-v", "error",
                "-select_streams", "v:0",
                "-show_entries", "stream=width,height",
                "-of", "json",
                videoPath
        );

        Process process = pb.start();

        // 결과 읽기
        BufferedReader reader = new BufferedReader(
                new InputStreamReader(process.getInputStream())
        );
        StringBuilder output = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            output.append(line);
        }

        // JSON 파싱
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(output.toString());
        JsonNode stream = root.get("streams").get(0);

        int width = stream.get("width").asInt();
        int height = stream.get("height").asInt();

        return new Info(width, height);
    }
}