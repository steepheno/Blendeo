package Blendeo.backend.project.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Component
@Getter
public class VideoInfoGetter {
    @Value("${ffprobe.path}")
    public String ffprobePath;

    public class Info {
        public int width;
        public int height;
        public int rotation;
        Info(int width, int height, int rotation) {
            this.width = width;
            this.height = height;
            this.rotation = rotation;
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
        // rotation 정보 추가
        int rotation = -1;
        if (stream.has("side_data_list")) {
            JsonNode sideData = stream.get("side_data_list").get(0);
            if (sideData.has("rotation")) {
                rotation = sideData.get("rotation").asInt();
            }
        }

        return new Info(width, height, rotation);
    }
}