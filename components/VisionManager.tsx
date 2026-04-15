'use client';

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as PoseModule from '@mediapipe/pose';
import { usePoseStore, PoseState } from '@/store/poseStore';
import { evaluatePose } from '@/lib/ai-coach';

const VisionManager = () => {
  const webcamRef = useRef<Webcam>(null);
  const setLandmarks = usePoseStore((state: PoseState) => state.setLandmarks);
  const setCameraStream = usePoseStore((state: PoseState) => state.setCameraStream);
  const [cameraActive, setCameraActive] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const pose = new PoseModule.Pose({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results: PoseModule.Results) => {
      if (results.poseLandmarks) {
        // Update Store with raw landmarks
        setLandmarks(results);

        // AI Coach Logic
        const evaluation = evaluatePose(results.poseLandmarks);
        usePoseStore.getState().setScore(evaluation.score);
        usePoseStore.getState().setFeedback(evaluation.message);
      }
    });

    // Manual animation loop instead of using Camera utility
    const sendFrameToMediaPipe = async () => {
      if (webcamRef.current?.video && webcamRef.current.video.readyState === 4) {
        await pose.send({ image: webcamRef.current.video });
      }
      animationFrameRef.current = requestAnimationFrame(sendFrameToMediaPipe);
    };

    // Start the loop once video is ready
    const startDetection = () => {
      setCameraActive(true);
      sendFrameToMediaPipe();
    };

    // Wait for webcam to be ready
    const checkWebcam = setInterval(() => {
      if (webcamRef.current?.video?.readyState === 4) {
        clearInterval(checkWebcam);
        startDetection();
      }
    }, 100);

    return () => {
      clearInterval(checkWebcam);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      pose.close();
    };
  }, [setLandmarks]);

  const handleUserMedia = (stream: MediaStream) => {
    setCameraActive(true);
    setCameraStream(stream);
  };

  return (
    <div className="fixed top-0 left-0 z-0 opacity-0 pointer-events-none">
      <Webcam
        ref={webcamRef}
        style={{
          width: 640,
          height: 480,
        }}
        onUserMedia={handleUserMedia}
      />
    </div>
  );
};

export default VisionManager;
