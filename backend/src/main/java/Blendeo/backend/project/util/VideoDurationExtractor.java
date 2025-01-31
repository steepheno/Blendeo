package Blendeo.backend.project.util;

import lombok.extern.slf4j.Slf4j;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.probe.FFmpegProbeResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@Component
@Slf4j
public class VideoDurationExtractor {

    @Value("${ffprobe.path}")
    String ffmpegPath;

    public int extractVideoDuration(File file) {
        try {
            /** 나중에 언젠가 사용할 것이라 남겨둠 **/
//            File tempFile = File.createTempFile("temp", file.getOriginalFilename());
//            file.transferTo(tempFile);

            FFprobe ffprobe = new FFprobe(ffmpegPath);
            FFmpegProbeResult fFmpegProbeResult = ffprobe.probe(file.getAbsolutePath());

            return (int) fFmpegProbeResult.getFormat().duration;
        } catch (IOException e){
            throw new RuntimeException("Failed to process video file", e);
        }
    }
}
