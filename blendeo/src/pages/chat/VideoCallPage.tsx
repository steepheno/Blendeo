// src/pages/chat/VideoCallPage.tsx
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";
import { useChatStore } from "@/stores/chatStore";
import VideoComponent from "@/components/videoCall/VideoComponent";
import Layout from "@/components/layout/Layout";
import {
  Session,
  Publisher,
  Subscriber,
  VideoDevice,
  OpenViduInstance,
  StreamEvent,
  ExceptionEvent,
} from "@/types/components/video/openvidu";

const APPLICATION_SERVER_URL = import.meta.env.VITE_OPENVIDU_SERVER_URL;

const VideoCallPage: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const currentUser = useUserStore((state) => state.currentUser);
  const currentRoom = useChatStore((state) => state.currentRoom);

  const [session, setSession] = useState<Session | undefined>(undefined);
  const [mainStreamManager, setMainStreamManager] = useState<
    Publisher | undefined
  >(undefined);
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [currentVideoDevice, setCurrentVideoDevice] = useState<
    VideoDevice | undefined
  >(undefined);
  const [OV, setOV] = useState<OpenViduInstance | null>(null);

  const createSession = useCallback(async (sessionId: string) => {
    try {
      // 먼저 세션이 존재하는지 확인
      const checkSession = await axios
        .get(`${APPLICATION_SERVER_URL}openvidu/api/sessions/${sessionId}`, {
          headers: {
            Authorization: `Basic ${btoa(`OPENVIDUAPP:${import.meta.env.VITE_OPENVIDU_SECRET}`)}`,
          },
        })
        .catch(() => null);

      if (checkSession?.data) {
        return sessionId;
      }

      const response = await axios.post(
        APPLICATION_SERVER_URL + "openvidu/api/sessions",
        { customSessionId: sessionId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`OPENVIDUAPP:${import.meta.env.VITE_OPENVIDU_SECRET}`)}`,
          },
        }
      );
      return response.data.sessionId;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        return sessionId;
      }
      console.error("Error creating session:", error);
      throw error;
    }
  }, []);

  const createToken = useCallback(async (sessionId: string) => {
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL +
          `openvidu/api/sessions/${sessionId}/connection`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(`OPENVIDUAPP:${import.meta.env.VITE_OPENVIDU_SECRET}`)}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating token:", error);
      throw error;
    }
  }, []);

  const getToken = useCallback(async () => {
    if (!roomId) throw new Error("Room ID is required");
    try {
      const sessionId = await createSession(roomId);
      if (!sessionId) throw new Error("Failed to create session");

      const tokenResponse = await createToken(sessionId);
      return tokenResponse.token;
    } catch (error) {
      console.error("Error getting token:", error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return getToken();
      }
      throw error;
    }
  }, [roomId, createSession, createToken]);

  const leaveSession = useCallback(() => {
    if (!session) {
      return;
    }

    try {
      session.disconnect();
    } catch (error) {
      console.error("Error disconnecting from session:", error);
    } finally {
      setOV(null);
      setSession(undefined);
      setSubscribers([]);
      setMainStreamManager(undefined);
      setPublisher(undefined);
      navigate(`/chat/${roomId}`);
    }
  }, [session, navigate, roomId]);

  const handleMainVideoStream = useCallback(
    (stream: Publisher | Subscriber) => {
      if (mainStreamManager !== stream) {
        setMainStreamManager(stream);
      }
    },
    [mainStreamManager]
  );

  const switchCamera = useCallback(async () => {
    if (!OV || !session || !currentVideoDevice || !mainStreamManager) {
      console.error("Required objects are not initialized");
      return;
    }

    try {
      const devices = await OV.getDevices();
      const videoDevices = devices.filter(
        (device): device is VideoDevice => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          await session.unpublish(mainStreamManager);
          await session.publish(newPublisher);

          setCurrentVideoDevice(newVideoDevice[0]);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e) {
      console.error("Error switching camera:", e);
    }
  }, [OV, session, mainStreamManager, currentVideoDevice]);

  const joinSession = useCallback(async () => {
    if (session) {
      console.log("Session already exists");
      return;
    }

    try {
      const newOV = new OpenVidu() as unknown as OpenViduInstance;

      if (OV) {
        setOV(null);
        setSession(undefined);
      }

      setOV(newOV);

      const newSession = newOV.initSession();

      // 이벤트 리스너 설정 전에 이전 리스너 제거
      if (newSession.removeAllListeners) {
        newSession.removeAllListeners("streamCreated");
        newSession.removeAllListeners("streamDestroyed");
        newSession.removeAllListeners("exception");
      }

      newSession.on("streamCreated", (event: StreamEvent) => {
        const subscriber = newSession.subscribe(event.stream, undefined);
        setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
      });

      newSession.on("streamDestroyed", (event: StreamEvent) => {
        setSubscribers((prevSubscribers) => {
          const index = prevSubscribers.findIndex(
            (sub) => sub.stream === event.stream
          );
          if (index > -1) {
            const newSubscribers = [...prevSubscribers];
            newSubscribers.splice(index, 1);
            return newSubscribers;
          }
          return prevSubscribers;
        });
      });

      newSession.on("exception", (exception: ExceptionEvent) => {
        console.warn("Session exception:", exception);
      });

      setSession(newSession);

      const token = await getToken();
      if (!token) {
        throw new Error("Failed to get token");
      }

      await newSession.connect(token, {
        clientData: currentUser?.nickname || "Anonymous",
      });

      const newPublisher = await newOV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      await newSession.publish(newPublisher);

      const devices = await newOV.getDevices();
      const videoDevices = devices.filter(
        (device): device is VideoDevice => device.kind === "videoinput"
      );
      const currentVideoDeviceId = newPublisher.stream
        .getMediaStream()
        .getVideoTracks()[0]
        .getSettings().deviceId;
      const foundVideoDevice = videoDevices.find(
        (device) => device.deviceId === currentVideoDeviceId
      );

      if (foundVideoDevice) {
        setCurrentVideoDevice(foundVideoDevice);
      }
      setMainStreamManager(newPublisher);
      setPublisher(newPublisher);
    } catch (error) {
      console.error("Error joining session:", error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        console.log("Session conflict detected, retrying after delay...");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (currentUser && roomId) {
          joinSession();
        }
      } else {
        console.error("Fatal error joining session:", error);
        leaveSession();
      }
    }
  }, [session, OV, currentUser, roomId, getToken, leaveSession]);

  useEffect(() => {
    if (!currentUser || !roomId) {
      navigate("/chat");
      return;
    }

    const onBeforeUnload = () => {
      if (session) {
        leaveSession();
      }
    };

    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      if (session) {
        leaveSession();
      }
    };
  }, [leaveSession, currentUser, roomId, navigate, session]);

  // 두 번째 useEffect 수정
  useEffect(() => {
    const initSession = async () => {
      try {
        if (currentUser && roomId && !session) {
          await joinSession();
        }
      } catch (error) {
        console.error("Failed to join session:", error);
      }
    };

    initSession();
  }, [currentUser, roomId, session, joinSession]);

  useEffect(() => {
    let isComponentMounted = true;

    if (currentUser && roomId && !session) {
      joinSession().catch((error) => {
        if (isComponentMounted) {
          console.error("Failed to join session:", error);
        }
      });
    }

    return () => {
      isComponentMounted = false;
    };
  }, [currentUser, roomId, session, joinSession]);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              Video Call - {currentRoom?.name || `Room ${roomId}`}
            </h1>
            <div className="space-x-2">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={leaveSession}
              >
                Leave Call
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={switchCamera}
              >
                Switch Camera
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainStreamManager && (
              <div className="w-full aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <VideoComponent streamManager={mainStreamManager} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              {publisher && (
                <div
                  className="aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleMainVideoStream(publisher)}
                >
                  <VideoComponent streamManager={publisher} />
                </div>
              )}
              {subscribers.map((sub) => (
                <div
                  key={sub.id}
                  className="aspect-video bg-gray-900 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleMainVideoStream(sub)}
                >
                  <VideoComponent streamManager={sub} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoCallPage;
