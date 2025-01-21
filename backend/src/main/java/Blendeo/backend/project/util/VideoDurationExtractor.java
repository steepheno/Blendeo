package Blendeo.backend.project.util;

import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.probe.FFmpegProbeResult;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

public class VideoDurationExtractor {
    public static int extractVideoDuration(MultipartFile file) {
        try {
            File tempFile = File.createTempFile("temp", file.getOriginalFilename());
            file.transferTo(tempFile);

            FFprobe ffprobe = new FFprobe("C:\\Users\\SSAFY\\Desktop\\ffmpeg-2025-01-15-git-4f3c9f2f03-essentials_build\\ffmpeg-2025-01-15-git-4f3c9f2f03-essentials_build\\bin\\ffprobe.exe");
            FFmpegProbeResult fFmpegProbeResult = ffprobe.probe(tempFile.getAbsolutePath());

            int duration = (int) fFmpegProbeResult.getFormat().duration;

            tempFile.delete();

            return duration;
        } catch (IOException e){
            throw new RuntimeException("Failed to process video file", e);
        }
    }
}
