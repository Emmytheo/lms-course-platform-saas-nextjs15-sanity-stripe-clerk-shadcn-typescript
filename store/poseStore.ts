import { create } from 'zustand';
import { Results } from '@mediapipe/pose';

export interface PoseState {
  landmarks: Results | null;
  score: number;
  feedback: string;
  isSessionActive: boolean;
  calibration: { x: number; y: number; z: number };
  cameraStream: MediaStream | null;
  
  // Actions
  setLandmarks: (landmarks: Results) => void;
  setScore: (score: number) => void;
  setFeedback: (feedback: string) => void;
  setSessionActive: (active: boolean) => void;
  setCalibration: (calibration: { x: number; y: number; z: number }) => void;
  setCameraStream: (stream: MediaStream | null) => void;
}

export const usePoseStore = create<PoseState>((set) => ({
  landmarks: null,
  score: 0,
  feedback: "Align yourself with the ghost",
  isSessionActive: false,
  calibration: { x: 0, y: 0, z: 0 },
  cameraStream: null,

  setLandmarks: (landmarks) => set({ landmarks }),
  setScore: (score) => set({ score }),
  setFeedback: (feedback) => set({ feedback }),
  setSessionActive: (active) => set({ isSessionActive: active }),
  setCalibration: (calibration) => set({ calibration }),
  setCameraStream: (stream) => set({ cameraStream: stream }),
}));
