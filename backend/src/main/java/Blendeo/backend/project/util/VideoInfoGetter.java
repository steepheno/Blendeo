package Blendeo.backend.project.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Iterator;

@Slf4j
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

    public void printAllMetadata(JsonNode node, String prefix) {
        if (node.isObject()) {
            Iterator<String> fieldNames = node.fieldNames();
            while (fieldNames.hasNext()) {
                String fieldName = fieldNames.next();
                JsonNode fieldValue = node.get(fieldName);
                if (fieldValue.isObject() || fieldValue.isArray()) {
                    log.info("{}{}:", prefix, fieldName);
                    printAllMetadata(fieldValue, prefix + "  ");
                } else {
                    log.info("{}{}: {}", prefix, fieldName, fieldValue);
                }
            }
        } else if (node.isArray()) {
            for (int i = 0; i < node.size(); i++) {
                log.info("{}[{}]:", prefix, i);
                printAllMetadata(node.get(i), prefix + "  ");
            }
        }
    }

    public Info getVideoInfo(String videoPath) throws IOException {
        ProcessBuilder pb = new ProcessBuilder(
                ffprobePath,
                "-v", "error",
                "-show_streams",
                "-show_entries", "stream=index,codec_type,width,height,side_data_list",
                "-of", "json",
                videoPath
        );

        Process process = pb.start();

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

        // 전체 JSON 로그 출력 (디버깅용)
        log.info("=== Full FFprobe Metadata ===");
        log.info(root.toPrettyString());
        log.info("===========================");

        JsonNode streams = root.path("streams");

        if (streams.isEmpty()) {
            log.error("No streams found in the file. Full JSON: {}", root.toPrettyString());
            throw new RuntimeException("No streams found in the file");
        }

        // 비디오 스트림 찾기
        JsonNode videoStream = null;
        for (JsonNode stream : streams) {
            if (stream.has("codec_type") && "video".equals(stream.get("codec_type").asText())) {
                videoStream = stream;
                break;
            }
        }

        if (videoStream == null) {
            log.error("No valid video stream found in the file. Full JSON: {}", root.toPrettyString());
            throw new RuntimeException("No valid video stream found in the file");
        }

        if (!videoStream.has("width") || !videoStream.has("height")) {
            log.error("Width or height information is missing. Full JSON: {}", root.toPrettyString());
            throw new RuntimeException("Width or height information is missing in the video metadata");
        }

        int width = videoStream.get("width").asInt();
        int height = videoStream.get("height").asInt();

        // rotation 정보 확인
        int rotation = 0;
        JsonNode sideDataList = videoStream.path("side_data_list");
        if (!sideDataList.isMissingNode()) {
            for (JsonNode sideData : sideDataList) {
                if (sideData.has("rotation")) {
                    rotation = sideData.get("rotation").asInt();
                    break;
                }
            }
        }

        // 90도나 270도 회전된 경우 width와 height 교환
        if (Math.abs(rotation) == 90 || Math.abs(rotation) == 270) {
            int temp = width;
            width = height;
            height = temp;
        }

        log.info("Final Video Info -> Width: {}, Height: {}, Rotation: {}", width, height, rotation);
        return new Info(width, height, rotation);
    }
}
