import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useWebRTC } from '../context/WebRTCContext';
import { Eraser, Pen, Trash2, Brush, SprayCan } from 'lucide-react';

export const Whiteboard = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#10b981');
    const [tool, setTool] = useState('pen'); // 'pen', 'brush', 'spray', 'eraser'
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
    const socket = useSocket();
    const { roomId } = useWebRTC();

    const drawStroke = (ctx, payload) => {
        const { x0, y0, x1, y1, tool, color, isEraser } = payload;

        // for backward compatibility with clients that haven't refreshed
        const activeTool = isEraser ? 'eraser' : (tool || 'pen');

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (activeTool === 'eraser') {
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.strokeStyle = '#022c22';
            ctx.lineWidth = 20;
            ctx.stroke();
            ctx.closePath();
        } else if (activeTool === 'brush') {
            ctx.beginPath();
            ctx.globalAlpha = 0.2;
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.strokeStyle = color;
            ctx.lineWidth = 15;
            ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1.0;
        } else if (activeTool === 'spray') {
            ctx.fillStyle = color;
            const density = 20;
            const radius = 15;
            for (let i = 0; i < density; i++) {
                const angle = Math.random() * Math.PI * 2;
                const r = Math.random() * radius;
                const px = x1 + Math.cos(angle) * r;
                const py = y1 + Math.sin(angle) * r;
                ctx.fillRect(px, py, 2, 2);
            }
        } else {
            // default Pen
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }
    };

    useEffect(() => {
        if (!socket) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const handleDrawAction = (payload) => {
            drawStroke(ctx, payload);
        };

        const handleClearCanvas = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };

        socket.on('draw-action', handleDrawAction);
        socket.on('clear-canvas', handleClearCanvas);

        return () => {
            socket.off('draw-action', handleDrawAction);
            socket.off('clear-canvas', handleClearCanvas);
        };
    }, [socket]);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        const pos = getCoordinates(e);
        setLastPos(pos);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getCoordinates(e);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const payload = {
            roomId,
            x0: lastPos.x,
            y0: lastPos.y,
            x1: x,
            y1: y,
            color,
            tool
        };

        drawStroke(ctx, payload);
        socket.emit('draw-action', payload);
        setLastPos({ x, y });
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        socket.emit('clear-canvas', roomId);
    };

    return (
        <div className="flex flex-col h-full bg-bottle-dark rounded-lg p-4">
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 40, height: 40, padding: 0, margin: 0, border: 'none', cursor: 'pointer', borderRadius: 6 }} title="Choose color" />

                <button className={`btn flex items-center gap-2 ${tool === 'pen' ? 'btn-primary' : ''}`} onClick={() => setTool('pen')}>
                    <Pen size={18} /> <span className="hidden xl:inline">Pen</span>
                </button>
                <button className={`btn flex items-center gap-2 ${tool === 'brush' ? 'btn-primary' : ''}`} onClick={() => setTool('brush')}>
                    <Brush size={18} /> <span className="hidden xl:inline">Brush</span>
                </button>
                <button className={`btn flex items-center gap-2 ${tool === 'spray' ? 'btn-primary' : ''}`} onClick={() => setTool('spray')}>
                    <SprayCan size={18} /> <span className="hidden xl:inline">Spray</span>
                </button>
                <div className="w-px h-6 bg-sage-dark hidden sm:block mx-1"></div>
                <button className={`btn flex items-center gap-2 ${tool === 'eraser' ? 'btn-primary' : ''}`} onClick={() => setTool('eraser')}>
                    <Eraser size={18} /> <span className="hidden xl:inline">Eraser</span>
                </button>

                <div className="flex-1" />

                <button className="btn btn-danger flex items-center gap-2" onClick={clearCanvas}>
                    <Trash2 size={18} /> <span className="hidden xl:inline">Clear</span>
                </button>
            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                style={{ border: '1px solid #333', background: '#022c22', cursor: 'crosshair', width: '100%', display: 'block' }}
                className="flex-1 rounded"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
            />
        </div>
    );
};
