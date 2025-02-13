import { useState, useCallback, useRef } from "react";
import { OpenVidu, Publisher, Session, Subscriber } from "openvidu-browser";
import { OpenViduSession } from "../types/components/video/openvidu";
import { openViduApi } from "../api/openvidu";
import type { ConnectionResponse } from "../types/api/openvidu";

export const useOpenVidu = (roomId: string) => {
  const [session, setSession] = useState<OpenViduSession | null>(null);
  const [publisher, setPublisher] = useState<Publisher | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const OV = useRef<OpenVidu | null>(null);
  const sessionRef = useRef<Session | null>(null);

  const initializeSession = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Create a session and get the session ID
      console.log("Creating session...");
      const sessionId = await openViduApi.createSession(roomId);
      console.log("Session created with ID:", sessionId);

      // 2. Create a connection for the session and get the token
      console.log("Creating connection...");
      const connectionResponse = await openViduApi.createConnection(sessionId);
      console.log("Connection response:", connectionResponse);

      // connectionResponse에서 token 추출
      let token: string;
      if (typeof connectionResponse === "string") {
        token = connectionResponse;
      } else {
        const response = connectionResponse as ConnectionResponse;
        token = response.token || response.data?.token || "";
      }

      if (!token) {
        throw new Error("Invalid connection response format or missing token");
      }

      console.log("Got token:", token);

      // 3. Initialize OpenVidu
      console.log("Initializing OpenVidu...");
      OV.current = new OpenVidu();
      const session = OV.current.initSession();
      sessionRef.current = session;

      // 4. Set up session events
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

      // 5. Connect to the session with the token
      console.log("Connecting to session...");
      const clientData = {
        userName: "User" + Math.floor(Math.random() * 100),
        roomId, // roomId 사용
      };
      await session.connect(token, { clientData });

      // 6. Initialize publisher
      console.log("Initializing publisher...");
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

      setSession({
        sessionId,
        token,
      });

      console.log("Video call setup completed successfully");
    } catch (err) {
      console.error("Error in initializeSession:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to initialize session")
      );
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

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
