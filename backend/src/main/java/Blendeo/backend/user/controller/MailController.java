package Blendeo.backend.user.controller;

import Blendeo.backend.user.service.MailService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

@RequestMapping("/api/v1/mail")
@RestController
public class MailController {

    @Autowired
    private final MailService mailService;

    public MailController(MailService mailService) {
        this.mailService = mailService;
    }

    @PostMapping("/check")
    public ResponseEntity<?> MailSend(@RequestParam String email) {
        String authCode = null;
        try {
            authCode = mailService.sendMail(email);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok().body(authCode);
    }
}
