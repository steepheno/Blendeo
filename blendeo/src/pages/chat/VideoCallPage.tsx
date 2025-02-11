// src/pages/chat/VideoCallPage.tsx
import { useEffect, useState, useCallback } from "react";
import {
  useSearchParams,
  useNavigate,
  NavigateFunction,
} from "react-router-dom";
import { OpenVidu, Publisher, Session, Subscriber } from "openvidu-browser";
import { CallParticipant } from "@/components/videoCall/CallParticipant";
import { CallControl } from "@/components/videoCall/CallControl";
import Layout from "@/components/layout/Layout";
import { getToken } from "@/api/openvidu";
import { useAuthStore } from "@/stores/authStore";

const VideoCallPage = () => {
  const [searchParams] = useSearchParams();
  const navigate: NavigateFunction = useNavigate();
  const roomId = searchParams.get("roomId");
  const userId = useAuthStore((state) => state.userId);

  const [session, setSession] = useState<Session | undefined>(undefined);
  const [publisher, setPublisher] = useState<Publisher | undefined>(undefined);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [OV, setOV] = useState<OpenVidu | undefined>(undefined);
  const [duration, setDuration] = useState<string>("00:00:00");
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Timer useEffect
  useEffect(() => {
    const startTime: number = Date.now();
    const timer = setInterval(() => {
      const diff = Date.now() - startTime;
      const hours = Math.floor(diff / 3600000)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((diff % 3600000) / 60000)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((diff % 60000) / 1000)
        .toString()
        .padStart(2, "0");
      setDuration(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Session cleanup
  useEffect(() => {
    return () => {
      if (session) {
        session.disconnect();
      }
    };
  }, [session]);

  // Initialize session
  useEffect(() => {
    if (!roomId) {
      navigate("/chat");
      return;
    }

    const initializeSession = async () => {
      const ov = new OpenVidu();
      setOV(ov);

      const session = ov.initSession();
      setSession(session);

      session.on("streamCreated", ({ stream }) => {
        const subscriber = session.subscribe(stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      session.on("streamDestroyed", ({ stream }) => {
        setSubscribers((prev) =>
          prev.filter((sub) => sub.stream.streamId !== stream.streamId)
        );
      });

      try {
        const token = await getToken(roomId);
        await session.connect(token, { userId });

        const publisher = await ov.initPublisherAsync(undefined, {
          audioSource: undefined,
          videoSource: undefined,
          publishAudio: true,
          publishVideo: true,
          resolution: "640x480",
          frameRate: 30,
          insertMode: "APPEND",
          mirror: false,
        });

        session.publish(publisher);
        setPublisher(publisher);
      } catch (error) {
        console.error("Error connecting to session:", error);
      }
    };

    initializeSession();
  }, [roomId, userId, navigate]);

  const handleScreenShare = useCallback(async () => {
    if (!session || !OV) return;

    try {
      if (!isScreenSharing) {
        const screenPublisher = await OV.initPublisherAsync(undefined, {
          videoSource: "screen",
          publishAudio: false,
          mirror: false,
        });

        await session.publish(screenPublisher);
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing logic
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  }, [session, OV, isScreenSharing]);

  const controls = [
    {
      type: "audio" as const,
      isActive: publisher?.stream.audioActive,
      onClick: () => publisher?.publishAudio(!publisher.stream.audioActive),
      disabled: !publisher,
    },
    {
      type: "video" as const,
      isActive: publisher?.stream.videoActive,
      onClick: () => publisher?.publishVideo(!publisher.stream.videoActive),
      disabled: !publisher,
    },
    {
      type: "screen" as const,
      isActive: isScreenSharing,
      onClick: handleScreenShare,
      disabled: !session,
    },
    {
      type: "more" as const,
      onClick: () => {},
    },
    {
      type: "chat" as const,
      onClick: () => navigate(`/chat?roomId=${roomId}`),
    },
    {
      type: "end" as const,
      onClick: () => {
        session?.disconnect();
        navigate(`/chat`);
      },
    },
  ];

  return (
    <Layout showNotification={false}>
      <div>
        <div className="flex flex-col flex-1 justify-center px-16 py-2.5 rounded-xl bg-violet-100 bg-opacity-0 max-md:px-5">
          <div className="flex flex-col w-full max-md:max-w-full">
            <div className="flex flex-col w-full">
              {/* Header Section */}
              <header className="flex flex-wrap gap-3 items-center px-4 pt-4 pb-2 w-full border-b-2 border-violet-100 bg-gray-100 bg-opacity-0 max-md:max-w-full">
                <div className="flex-1 shrink self-stretch my-auto text-3xl font-bold leading-none text-black min-w-[240px] max-md:max-w-full">
                  Video Call
                </div>
                <div className="self-stretch my-auto text-xl leading-10 text-neutral-500">
                  {duration}
                </div>
                <div className="flex gap-1.5 justify-center items-center self-stretch my-auto w-12">
                  <span className="text-2xl">{subscribers.length + 1}</span>
                </div>
              </header>

              {/* Main Video Grid */}
              <main className="flex flex-wrap gap-3 justify-center items-center px-4 w-full text-2xl leading-none text-white whitespace-nowrap bg-white bg-opacity-0 min-h-[742px] max-md:max-w-full">
                <div className="flex flex-wrap gap-3 justify-center items-center self-stretch my-auto min-w-[240px] w-[1012px]">
                  <div className="flex grow shrink items-start self-stretch my-auto min-w-[240px] w-[950px] max-md:max-w-full">
                    <div className="flex flex-wrap gap-3 justify-center items-center min-h-[722px] min-w-[240px] w-[954px]">
                      {publisher && (
                        <CallParticipant
                          streamManager={publisher}
                          isMainUser={true}
                        />
                      )}
                      {subscribers.map((subscriber) => (
                        <CallParticipant
                          key={subscriber.stream.connection.connectionId}
                          streamManager={subscriber}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </main>

              {/* Footer Controls */}
              <footer className="flex gap-2 justify-center items-center px-4 py-3 w-full border-t border-violet-100 max-md:max-w-full">
                <div className="flex gap-2 justify-center items-center self-stretch px-6 py-1.5 my-auto bg-white min-w-[240px] rounded-[100px] max-md:px-5">
                  <div className="flex gap-8 justify-center items-center self-stretch my-auto min-w-[240px]">
                    {controls.map((control, index) => (
                      <CallControl key={index} {...control} />
                    ))}
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoCallPage;
