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
        // 전체 메타데이터를 가져오기 위해 명령어 수정
        ProcessBuilder pb = new ProcessBuilder(
                ffprobePath,
                "-v", "error",
                "-show_format",           // 포맷 정보 추가
                "-show_streams",          // 모든 스트림 정보 추가
                "-show_chapters",         // 챕터 정보 추가
                "-show_programs",         // 프로그램 정보 추가
                "-show_entries", "stream_tags=*:format_tags=*", // 모든 태그 정보 추가
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

        // 전체 JSON 출력
        log.info("=== Full FFprobe Metadata ===");
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.readTree(output.toString());
        printAllMetadata(root, "");
        log.info("===========================");

        // 기존 비디오 정보 처리
        JsonNode streams = root.path("streams");

        if (streams.isEmpty()) {
            log.error("No video streams found in the file");
            throw new RuntimeException("No video streams found in the file");
        }

        JsonNode stream = streams.get(0);
        JsonNode widthNode = stream.path("width");
        JsonNode heightNode = stream.path("height");

        if (widthNode.isMissingNode() || heightNode.isMissingNode()) {
            log.error("Width or height information is missing");
            throw new RuntimeException("Width or height information is missing");
        }

        int width = widthNode.asInt();
        int height = heightNode.asInt();

        // rotation 정보 확인
        int rotation = 0;
        JsonNode sideDataList = stream.path("side_data_list");
        if (!sideDataList.isMissingNode()) {
            for (JsonNode sideData: sideDataList){
                if (sideData.has("rotation")){
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

        System.out.println(width + ", " + height +", " + rotation);
        return new Info(width, height, rotation);
    }
}