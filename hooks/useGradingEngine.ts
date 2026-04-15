import { useFrame } from '@react-three/fiber';
import { usePoseStore } from '@/store/poseStore';
import * as THREE from 'three';
import { Results, NormalizedLandmark } from '@mediapipe/pose';

// Helper to get vector between two landmarks
const getVector = (landmarks: NormalizedLandmark[], startIdx: number, endIdx: number) => {
  const start = landmarks[startIdx];
  const end = landmarks[endIdx];
  return new THREE.Vector3(end.x - start.x, end.y - start.y, end.z - start.z);
};

// Cosine similarity between two vectors
const cosineSimilarity = (v1: THREE.Vector3, v2: THREE.Vector3) => {
  v1.normalize();
  v2.normalize();
  return v1.dot(v2);
};

// Mock Master Pose (Static T-Pose-ish for now)
// We need a full set of landmarks for the master. 
// For simplicity, we'll just check specific vectors against hardcoded target vectors.
// Or we can generate a mock landmark set.
// Let's define target vectors for the "Master" pose.
// T-Pose: Arms horizontal. Thighs vertical.
const MASTER_VECTORS = {
  leftForearm: new THREE.Vector3(1, 0, 0), // Pointing left
  rightForearm: new THREE.Vector3(-1, 0, 0), // Pointing right
  leftThigh: new THREE.Vector3(0, 1, 0), // Pointing down (Y increases downwards in MediaPipe usually, but we mapped it. Let's stick to MP coords for calculation)
  // Wait, MP coords: Y is down. So hip to knee is +Y.
  // Let's check MP coords again. (0,0) top-left.
  // Left Arm (Shoulder 11 -> Elbow 13 -> Wrist 15).
  // Right Arm (Shoulder 12 -> Elbow 14 -> Wrist 16).
  // Left Leg (Hip 23 -> Knee 25).
  // Right Leg (Hip 24 -> Knee 26).
};

export const useGradingEngine = () => {
  const userLandmarks = usePoseStore((state) => state.landmarks);
  const setScore = usePoseStore((state) => state.setScore);
  const setFeedback = usePoseStore((state) => state.setFeedback);

  useFrame(() => {
    if (!userLandmarks || !userLandmarks.poseLandmarks) return;

    const landmarks = userLandmarks.poseLandmarks;

    // Define vectors based on MP indices
    // 11-13 (L Upper Arm), 13-15 (L Forearm)
    // 12-14 (R Upper Arm), 14-16 (R Forearm)
    // 23-25 (L Thigh), 24-26 (R Thigh)

    const leftForearm = getVector(landmarks, 13, 15);
    const rightForearm = getVector(landmarks, 14, 16);
    const leftThigh = getVector(landmarks, 23, 25);
    const rightThigh = getVector(landmarks, 24, 26);

    // Compare with Master (T-Pose / Arms Out, Legs Straight)
    // Master L Forearm: Should be roughly horizontal pointing left (positive x in MP? No, x increases to right).
    // Left is user's left. In image, it's right side.
    // Let's assume user is facing camera.
    // Left Shoulder (11) is at x ~ 0.6, Right (12) at x ~ 0.4.
    // Left Arm out: 11 -> 13 -> 15. x increases.
    // So Vector(13->15) should be (+1, 0, 0).
    // Right Arm out: 12 -> 14 -> 16. x decreases. (-1, 0, 0).
    // Legs: 23->25. y increases (down). (0, 1, 0).

    const masterLeftForearm = new THREE.Vector3(1, 0, 0);
    const masterRightForearm = new THREE.Vector3(-1, 0, 0);
    const masterLeftThigh = new THREE.Vector3(0, 1, 0);
    const masterRightThigh = new THREE.Vector3(0, 1, 0);

    const scoreLForearm = cosineSimilarity(leftForearm, masterLeftForearm);
    const scoreRForearm = cosineSimilarity(rightForearm, masterRightForearm);
    const scoreLThigh = cosineSimilarity(leftThigh, masterLeftThigh);
    const scoreRThigh = cosineSimilarity(rightThigh, masterRightThigh);

    // Average score (-1 to 1). Map to 0-100.
    // We only care about positive alignment mostly? No, direction matters.
    // If perfect match, dot is 1.
    const avgSimilarity = (scoreLForearm + scoreRForearm + scoreLThigh + scoreRThigh) / 4;
    const percentage = Math.max(0, Math.round(avgSimilarity * 100));

    setScore(percentage);

    // Feedback
    if (percentage > 90) {
      setFeedback("Excellent! Hold it!");
    } else if (scoreLForearm < 0.7 || scoreRForearm < 0.7) {
      setFeedback("Straighten your arms!");
    } else if (scoreLThigh < 0.7 || scoreRThigh < 0.7) {
      setFeedback("Straighten your legs!");
    } else {
      setFeedback("Align with the ghost");
    }
  });
};
