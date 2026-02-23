import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { useSocket } from './SocketContext';

const WebRTCContext = createContext();

export const useWebRTC = () => useContext(WebRTCContext);

export const WebRTCProvider = ({ children }) => {
    const socket = useSocket();
    const [peers, setPeers] = useState([]);
    const [stream, setStream] = useState(null);
    const userVideo = useRef();
    const peersRef = useRef([]);
    const [roomId, setRoomId] = useState(null);

    useEffect(() => {
        if (!socket) return;

        // Get user media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });
    }, [socket]);

    // Join Room
    const joinRoom = (id, userDetails) => {
        setRoomId(id);
        socket.emit('join-room', id, userDetails);

        socket.on('all-users', (users) => {
            const peersArray = [];
            users.forEach((userID) => {
                const peer = createPeer(userID, socket.id, stream);
                peersRef.current.push({
                    peerID: userID,
                    peer,
                });
                peersArray.push({
                    peerID: userID,
                    peer,
                });
            });
            setPeers(peersArray);
        });

        socket.on('user-joined', (payload) => {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
                peerID: payload.callerID,
                peer,
            });

            const peerObj = {
                peerID: payload.callerID,
                peer,
            };

            setPeers((users) => [...users, peerObj]);
        });

        socket.on('receiving-returned-signal', (payload) => {
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            if (item) {
                item.peer.signal(payload.signal);
            }
        });

        socket.on('user-disconnected', (id) => {
            const peerObj = peersRef.current.find((p) => p.peerID === id);
            if (peerObj) {
                if (peerObj.peer) peerObj.peer.destroy();
            }
            peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
            setPeers((users) => users.filter((p) => p.peerID !== id));
        });
    };

    const iceServers = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
        ]
    };

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
            config: iceServers
        });

        peer.on('signal', (signal) => {
            socket.emit('sending-signal', { userToSignal, callerID, signal });
        });

        return peer;
    };

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
            config: iceServers
        });

        peer.on('signal', (signal) => {
            socket.emit('returning-signal', { signal, callerID });
        });

        peer.signal(incomingSignal);

        return peer;
    };

    // Screen Sharing Logic
    const shareScreen = async () => {
        try {
            const screenStream = await navigator.mediaDevices.getDisplayMedia({ cursor: true });
            const videoTrack = screenStream.getVideoTracks()[0];

            // Replace video track for all peers
            peersRef.current.forEach((peerObj) => {
                const sender = peerObj.peer._pc.getSenders().find((s) => s.track.kind === 'video');
                if (sender) {
                    sender.replaceTrack(videoTrack);
                }
            });

            // Update local video
            if (userVideo.current) {
                userVideo.current.srcObject = screenStream;
            }

            // Revert back when screen sharing stops
            videoTrack.onended = () => {
                const localVideoTrack = stream.getVideoTracks()[0];
                peersRef.current.forEach((peerObj) => {
                    const sender = peerObj.peer._pc.getSenders().find((s) => s.track.kind === 'video');
                    if (sender) {
                        sender.replaceTrack(localVideoTrack);
                    }
                });
                if (userVideo.current) {
                    userVideo.current.srcObject = stream;
                }
            };
        } catch (err) {
            console.error('Failed to share screen', err);
        }
    };

    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);

    const toggleAudio = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsAudioMuted(!audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoMuted(!videoTrack.enabled);
            }
        }
    };

    return (
        <WebRTCContext.Provider value={{
            peers, stream, userVideo, joinRoom, roomId, shareScreen,
            isAudioMuted, isVideoMuted, toggleAudio, toggleVideo
        }}>
            {children}
        </WebRTCContext.Provider>
    );
};
