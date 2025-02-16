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

        try {
            if(params != null && params.containsKey("sessionId")) {
                String sessionId = params.get("sessionId").toString();
                System.out.println("Requested sessionId: " + sessionId);

                // 모든 활성 세션 로깅
                System.out.println("Current active sessions:");
                openvidu.getActiveSessions().forEach(s ->
                        System.out.println("Session: " + s.getSessionId()));

                Session existingSession = openvidu.getActiveSession(sessionId);

                if (existingSession != null) {
                    System.out.println("Found existing session: " + existingSession.getSessionId());
                    return new ResponseEntity<>(existingSession.getSessionId(), HttpStatus.OK);
                }

                // 새 세션 생성
                SessionProperties newProperties = new SessionProperties.Builder()
                        .customSessionId(sessionId)
                        .build();

                Session newSession = openvidu.createSession(newProperties);
                System.out.println("Created new session: " + newSession.getSessionId());
                return new ResponseEntity<>(newSession.getSessionId(), HttpStatus.OK);
            }

            // sessionId가 없는 경우의 기본 처리
            SessionProperties defaultProperties = SessionProperties.fromJson(params).build();
            Session session = openvidu.createSession(defaultProperties);
            return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);

        } catch (OpenViduHttpException e) {
            System.err.println("OpenVidu error: " + e.getMessage());
            throw e; // 에러를 상위로 전파하여 적절한 처리 가능하도록
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
