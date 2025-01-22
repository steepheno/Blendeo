package Blendeo.backend.project.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class VideoServiceImpl implements VideoService {

    @Override
    public String uploadVideo(MultipartFile file) {
        // S3 file 저장 로직
        return "https://www.naver.com/";
    }
}
