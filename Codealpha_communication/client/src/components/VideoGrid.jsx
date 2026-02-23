import React, { useEffect, useRef } from 'react';
import { useWebRTC } from '../context/WebRTCContext';

const Video = ({ peer }) => {
    const ref = useRef();

    useEffect(() => {
        peer.on('stream', (stream) => {
            if (ref.current) {
                ref.current.srcObject = stream;
            }
        });
    }, [peer]);

    return (
        <div className="video-container" style={{ aspectRatio: '16/9' }}>
            <video playsInline autoPlay ref={ref} style={{ backgroundColor: '#022c22' }} />
        </div>
    );
};

export const VideoGrid = () => {
    const { peers, userVideo, stream } = useWebRTC();

    // Fix for local video not showing: force assignment when stream updates
    useEffect(() => {
        if (stream && userVideo.current) {
            userVideo.current.srcObject = stream;
        }
    }, [stream, userVideo]);

    return (
        <div className="video-grid">
            <div className="video-container" style={{ aspectRatio: '16/9' }}>
                <video playsInline muted autoPlay ref={userVideo} style={{ backgroundColor: '#022c22' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'rgba(2, 44, 34, 0.5)', padding: '2px 8px', borderRadius: 4 }}>You</div>
            </div>

            {peers.map((peer, index) => {
                return <Video key={index} peer={peer.peer} />;
            })}
        </div>
    );
};
