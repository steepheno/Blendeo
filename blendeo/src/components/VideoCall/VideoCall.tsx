// src/components/VideoCall/VideoCall.tsx
import React, { useEffect, useRef, useState } from 'react';
import SimplePeer from 'simple-peer';

const VideoCall: React.FC = () => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    const [connectionData, setConnectionData] = useState<string>('');

    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);

    // 로컬 비디오 스트림 시작
    const startLocalStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Failed to get local stream', err);
        }
    };

    // Peer 연결 초기화
    const initializePeer = (isInitiator: boolean) => {
        if (!localStream) return;
        console.log("here:",isInitiator);

        const newPeer = new SimplePeer({
            initiator: isInitiator,
            trickle: false,
            stream: localStream
        });

        console.log("newPeer:", newPeer);  // newPeer 객체가 생성되었는지 확인

        newPeer.on('signal', (data: SimplePeer.SignalData) => {
            // 연결 데이터를 문자열로 변환하여 저장
            setConnectionData(JSON.stringify(data));
        });

        newPeer.on('stream', (stream: MediaStream) => {
            // 원격 스트림을 비디오 엘리먼트에 연결
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = stream;
            }
        });

        setPeer(newPeer);
    };

    // 연결 데이터 처리
    const handleConnect = () => {
        if (!peer || !connectionData) return;

        try {
            const signalData = JSON.parse(connectionData);
            peer.signal(signalData);
        } catch (err) {
            console.error('Failed to parse connection data', err);
        }
    };

    // 컴포넌트 언마운트 시 정리
    useEffect(() => {
        return () => {
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (peer) {
                peer.destroy();
            }
        };
    }, [localStream, peer]);

    return (
        <div className="flex flex-col items-center p-4 space-y-4">
            <div className="flex space-x-4">
                <div className="relative">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-80 h-60 bg-gray-200 rounded"
                    />
                    <p className="absolute bottom-2 left-2 text-white">Local</p>
                </div>
                <div className="relative">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-80 h-60 bg-gray-200 rounded"
                    />
                    <p className="absolute bottom-2 left-2 text-white">Remote</p>
                </div>
            </div>

            <div className="flex flex-col space-y-4 w-full max-w-md">
                <button
                    onClick={() => startLocalStream()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Start Camera
                </button>

                <div className="flex space-x-2">
                    <button
                        onClick={() => initializePeer(true)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Create Connection
                    </button>
                    <button
                        onClick={() => initializePeer(false)}
                        className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Join Connection
                    </button>

                </div>

                <textarea
                    value={connectionData}
                    onChange={(e) => setConnectionData(e.target.value)}
                    placeholder="Paste connection data here..."
                    className="w-full h-32 p-2 border rounded"
                />

                <button
                    onClick={handleConnect}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                >
                    Connect
                </button>
            </div>
        </div>
    );
};

export default VideoCall;