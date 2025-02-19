// src/hooks/useOpenVidu.ts
import { useState, useCallback, useRef } from "react";
import { OpenVidu, Session } from "openvidu-browser";
import { openViduApi } from "../api/openvidu";
import type { ConnectionResponse } from "../types/api/openvidu";
import { useVideoCallStore } from "@/stores/videoCallStore";

/**
 * OpenVidu 화상 채팅 기능을 관리하는 커스텀 훅
 * WebRTC 연결, 스트림 관리, 오디오/비디오 제어 기능을 제공
 *
 * @param roomId - 채팅방 Session ID
 */
export const useOpenVidu = (roomId: string) => {
  // 상태 관리
  const {
    session,
    publisher,
    subscribers,
    setSession,
    setPublisher,
    setSubscribers,
    removeSubscriber,
    addSubscriber,
  } = useVideoCallStore();

  const [error, setError] = useState<Error | null>(null); // 에러 상태
  const [isLoading, setIsLoading] = useState(false);

  // OpenVidu 인스턴스 및 세션 참조 유지
  const OV = useRef<OpenVidu | null>(null);
  const sessionRef = useRef<Session | null>(null);

  /**
   * OpenVidu 세션을 초기화하고 연결하는 함수
   * 1. 세션 생성
   * 2. 연결 토큰 발급
   * 3. 스트림 이벤트 핸들러 설정
   * 4. 로컬 스트림 발행
   */
  const initializeSession = useCallback(async () => {
    try {
      console.log("initializeSession 실행");
      setIsLoading(true);
      setError(null);

      if (sessionRef.current) {
        return;
      }

      const sessionId = (await openViduApi.createSession(roomId)) as string;
      console.log("세션 초기화의 세션 아이디!: " + sessionId);

      const connectionResponse = await openViduApi.createConnection(sessionId);

      console.log("connectionResponse:", connectionResponse);
      let token: string;
      if (typeof connectionResponse === "string") {
        token = connectionResponse as string;
      } else {
        const response = connectionResponse as ConnectionResponse;
        token = response.token || response.data?.token || "";
      }

      if (!token) {
        throw new Error("Invalid connection response format or missing token");
      }

      OV.current = new OpenVidu();
      const session = OV.current.initSession();
      sessionRef.current = session;
      console.log("sessionRef.current: " + sessionRef.current);
      // streamCreated 이벤트 핸들러 수정
      session.on("streamCreated", (event) => {
        // 이미 구독중인 스트림인지 확인
        const isAlreadySubscribed = subscribers.some(
          (sub) => sub.stream.streamId === event.stream.streamId
        );

        if (!isAlreadySubscribed) {
          console.log("Subscribing to new stream:", event.stream.streamId);
          const subscriber = session.subscribe(event.stream, undefined);
          addSubscriber(subscriber);
        } else {
          console.log("Already subscribed to:", event.stream.streamId);
        }
      });

      // streamDestroyed 이벤트 핸들러 수정
      session.on("streamDestroyed", (event) => {
        console.log("Stream destroyed:", event);
        removeSubscriber(event.stream.streamId); // setSubscribers 대신 removeSubscriber 사용
      });

      const userName = `User${Math.floor(Math.random() * 100)}`;
      const connectionData = {
        clientData: userName, // 단순 문자열로 변경
      };

      const connectionString = JSON.stringify(connectionData);
      console.log("Connection string:", connectionString);

      await session.connect(token, connectionString);

      // Publisher 초기화 추가
      const publisher = await OV.current.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: true,
      });

      await session.publish(publisher);
      setPublisher(publisher);

      setSession(session);
    } catch (err) {
      console.error("Error in initializeSession:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to initialize session")
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    roomId,
    addSubscriber,
    removeSubscriber,
    setPublisher,
    setSession,
    subscribers,
  ]);

  /**
   * 세션을 정리하고 모든 연결을 종료하는 함수
   */
  // cleanup 함수에서
  const cleanupSession = useCallback(() => {
    console.log("cleanupSession 실행");
    console.log("sessionRef.current: " + sessionRef.current);
    if (sessionRef.current) {
      try {
        console.log("연결을 끊습니다.");
        sessionRef.current.disconnect();
      } catch (error) {
        console.error("Error disconnecting session:", error);
      }
    }
    setSession(null);
    setPublisher(null);
    setSubscribers([]); // clearSubscribers 대신 직접 빈 배열로 설정
    setError(null);
    OV.current = null;
    sessionRef.current = null;
  }, [setSession, setPublisher, setSubscribers]);

  /**
   * 오디오 스트림을 토글하는 함수
   */
  const toggleAudio = useCallback(() => {
    if (publisher) {
      const isAudioEnabled = publisher.stream.audioActive;
      publisher.publishAudio(!isAudioEnabled);
    }
  }, [publisher]);

  /**
   * 비디오 스트림을 토글하는 함수
   */
  const toggleVideo = useCallback(() => {
    if (publisher) {
      const isVideoEnabled = publisher.stream.videoActive;
      publisher.publishVideo(!isVideoEnabled);
    }
  }, [publisher]);

  return {
    session,
    error,
    isLoading,
    publisher,
    subscribers,
    initializeSession,
    cleanupSession,
    toggleAudio,
    toggleVideo,
  };
};
