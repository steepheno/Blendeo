package Blendeo.backend.user.controller;

import Blendeo.backend.user.service.MailService;
import Blendeo.backend.user.vo.MailVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

@RequestMapping("/api/mail")
@RestController
public class MailController {

    @Autowired
    private final MailService mailService;

    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> MailSend(MailVo mailVo) {
        mailService.CreateMail(mailVo);
        return ResponseEntity.ok().body("성공했습니다!");
    }
}
