'use client';

import React, { useEffect, useRef } from 'react';
import { usePoseStore } from '@/store/poseStore';
import { POSE_CONNECTIONS } from '@/components/visuals/Skeleton';

const PoseOverlay = () => {
  const cameraStream = usePoseStore((state) => state.cameraStream);
  const landmarks = usePoseStore((state) => state.landmarks);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set video stream
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Draw landmarks
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !ctx || !landmarks?.poseLandmarks) {
        if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw connections
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#00FF00'; // Green connections

    const poseLandmarks = landmarks.poseLandmarks;

    POSE_CONNECTIONS.forEach(([startIdx, endIdx]) => {
      const start = poseLandmarks[startIdx];
      const end = poseLandmarks[endIdx];

      if (start && end && (start.visibility || 0) > 0.5 && (end.visibility || 0) > 0.5) {
        ctx.beginPath();
        ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
        ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
        ctx.stroke();
      }
    });

    // Draw landmarks
    ctx.fillStyle = '#FF0000'; // Red joints
    poseLandmarks.forEach((landmark) => {
      if ((landmark.visibility || 0) > 0.5) {
        ctx.beginPath();
        ctx.arc(landmark.x * canvas.width, landmark.y * canvas.height, 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

  }, [landmarks]);

  if (!cameraStream) {
    return <div className="flex items-center justify-center h-64 bg-black/10 rounded-lg">No Camera Feed</div>;
  }

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover transform -scale-x-100" // Mirror video
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute top-0 left-0 w-full h-full object-cover transform -scale-x-100" // Mirror canvas to match video
      />
    </div>
  );
};

export default PoseOverlay;
