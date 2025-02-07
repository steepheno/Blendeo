package Blendeo.backend.user.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailService {
    private final JavaMailSender javaMailSender;
    private final RedisTemplate<String, String> redisTemplate;

    private static final String senderEmail = "blendeo.ssafy@gmail.com";
    private static final String title = "[BLENDEO 회원가입]: 인증번호 발송";

    public String sendMail(String receiver) throws MessagingException {

        // 랜덤 비밀번호 생성
        String authCode = createAuthCode();

        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8");

        helper.setTo(receiver);
        helper.setFrom(senderEmail);
        helper.setSubject(title);

        StringBuilder body = new StringBuilder();
        body.append("<h3>BLENDEO에서 요청하신 인증 번호입니다.</h3>");
        body.append("<h1>").append(authCode).append("</h1>");
        body.append("<h3>감사합니다.</h3>");
        helper.setText(body.toString(), true); // true = HTML 사용

        javaMailSender.send(mimeMessage);

        log.info(authCode);
        redisTemplate.opsForValue().set(receiver, authCode);

        return authCode;
    }

    public String createAuthCode() {
        Random random = new Random();
        StringBuilder key = new StringBuilder();

        for (int i = 0; i < 6; i++) { // 인증 코드 6자리
            key.append(random.nextInt(10));
        }
        return key.toString();
    }

    public boolean checkAuthCode(String email, String authCode) {
        String storedAuthCode = redisTemplate.opsForValue().get(email);

        if (storedAuthCode != null && storedAuthCode.equals(authCode)) {
            redisTemplate.delete(email);
            return true;
        }
        return false;
    }
}
