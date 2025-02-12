// src/hooks/useOpenVidu.ts
import { useState, useCallback, useRef } from "react";
import { OpenVidu, Publisher, Session, Subscriber } from "openvidu-browser";
import { OpenViduSession } from "../types/components/video/openvidu";
import { openViduApi } from "../api/openvidu";

export const useOpenVidu = () => {
  const [session, setSession] = useState<OpenViduSession | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const OV = useRef<OpenVidu | null>(null);
  const sessionRef = useRef<Session | null>(null);

  // src/hooks/useOpenVidu.ts
  const initializeSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Create a session
      const sessionResponse = await openViduApi.createSession();
      console.log("Session response:", sessionResponse);

      // 2. Create a connection for the session and get full response
      const connectionResponse =
        await openViduApi.createConnection(sessionResponse);
      console.log("Connection response:", connectionResponse);

      // OpenVidu 토큰 형식: "wss://openvidu.blendeo.shop/openvidu/cdr"
      const token = `wss://openvidu.blendeo.shop/openvidu/cdr`;

      // 4. Initialize OpenVidu
      OV.current = new OpenVidu();
      const session = OV.current.initSession();
      sessionRef.current = session;

      // 5. Set up session events
      session.on("streamCreated", (event) => {
        console.log("Stream created:", event);
        const subscriber = session.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      session.on("streamDestroyed", (event) => {
        console.log("Stream destroyed:", event);
        setSubscribers((prev) =>
          prev.filter((sub) => sub.stream.streamId !== event.stream.streamId)
        );
      });

      session.on("connectionCreated", (event) => {
        console.log("Connection created:", event);
      });

      session.on("connectionDestroyed", (event) => {
        console.log("Connection destroyed:", event);
      });

      // 6. Connect to the session with the token
      console.log("Connecting with token:", token);
      await session.connect(token, {
        clientData: JSON.stringify({
          userName: "User" + Math.floor(Math.random() * 100),
          roomId: sessionResponse,
        }),
      });

      // 7. Initialize publisher
      console.log("Initializing publisher");
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

      console.log("Publishing stream");
      await session.publish(publisher);
      setPublisher(publisher);

      setSession({
        sessionId: sessionResponse,
        token: token,
      });
    } catch (err) {
      console.error("Error in initializeSession:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to initialize session")
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cleanupSession = useCallback(() => {
    if (sessionRef.current) {
      try {
        sessionRef.current.disconnect();
      } catch (error) {
        console.error("Error disconnecting session:", error);
      }
    }
    setSession(null);
    setPublisher(null);
    setSubscribers([]);
    setError(null);
    OV.current = null;
    sessionRef.current = null;
  }, []);

  const toggleAudio = useCallback(() => {
    if (publisher) {
      const isAudioEnabled = publisher.stream.audioActive;
      publisher.publishAudio(!isAudioEnabled);
    }
  }, [publisher]);

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
