package Blendeo.backend.openvidu;


import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;
import jakarta.annotation.PostConstruct;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/v1/sessions")
@RestController
public class OpenviduController {

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /* session properties, return Seesion ID */
    @PostMapping
    public ResponseEntity<String> initializeSession(@RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        // 기존에 같은 방의 채팅 세션이 이미 열려있으면 그 세션 아이디 반환!
        SessionProperties properties = SessionProperties.fromJson(params).build();

        try {
            if(params != null && params.containsKey("sessionId")) {
                System.out.println("sessionId: " + params.get("sessionId"));
                String sessionId = params.get("sessionId").toString();
                Session existingSession = openvidu.getActiveSession(sessionId);

                if (existingSession != null) {
                    System.out.println("existingSessionId: " + existingSession.getSessionId());
                    // 이미 존재하는 세션이면 해당 세션 아이디 반환
                    return new ResponseEntity<>(existingSession.getSessionId(), HttpStatus.OK);
                }
            }

            Session session = openvidu.createSession(properties);
            return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);

        } catch (OpenViduHttpException e) {
            // 세션이 없거나 에러가 발생한 경우 새 세션 생성
            Session session = openvidu.createSession(properties);
            return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
        }
    }

    @PostMapping("/{session_id}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("session_id") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {
        Session session = openvidu.getActiveSession(sessionId);
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);

        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }

    // 기존에 같은 방의 세션이 존재하는지?

}
