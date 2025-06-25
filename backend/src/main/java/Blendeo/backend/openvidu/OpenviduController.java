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
            System.out.println("OpenVidu URL: " + OPENVIDU_URL);

            if(params != null && params.containsKey("sessionId")) {
                String sessionId = params.get("sessionId").toString();
                System.out.println("요청한 sessionId: " + sessionId);

                openvidu.fetch();

                // 모든 활성 세션 로깅
                System.out.println("현재 활성화된 세션 목록");
                openvidu.getActiveSessions().forEach(s ->
                        System.out.println("세션: " + s.getSessionId()));

                Session existingSession = openvidu.getActiveSession(sessionId);

                if (existingSession != null) {
                    System.out.println("기존에 존재하는 세션: " + existingSession.getSessionId());
                    return new ResponseEntity<>(existingSession.getSessionId(), HttpStatus.OK);
                }

                // 새 세션 생성
                SessionProperties newProperties = new SessionProperties.Builder()
                        .customSessionId(sessionId)
                        .build();

                Session newSession = openvidu.createSession(newProperties);
                System.out.println("새로운 세션을 생성합니다: " + newSession.getSessionId());
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
        try {
            System.out.println("세션을 만듭니다: " + sessionId);

            // 세션 목록 업데이트
            openvidu.fetch();

            Session session = openvidu.getActiveSession(sessionId);
            if (session == null) {
                System.err.println("세션이 발견되지 않았습니다: " + sessionId);
                return new ResponseEntity<>("세션이 발견되지 않았습니다", HttpStatus.NOT_FOUND);
            }

            ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
            System.out.println("연결을 생성하였습니다.: " + properties);

            Connection connection = session.createConnection(properties);
            System.out.println("Connection created successfully with token: " + connection.getToken());

            return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
        } catch (OpenViduHttpException e) {
            System.err.println("연결 생성시 에러가 발생하였습니다: " + e.getMessage() + ", Status: " + e.getStatus());
            throw e;
        }
    }

    // 기존에 같은 방의 세션이 존재하는지?

}
