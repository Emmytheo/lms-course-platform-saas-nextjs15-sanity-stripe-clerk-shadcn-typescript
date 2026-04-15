'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { usePoseStore } from '@/store/poseStore';
import { POSE_CONNECTIONS } from './Skeleton'; // Reuse connections
import { useGradingEngine } from '@/hooks/useGradingEngine';

// Re-define NormalizedLandmark locally to avoid import issues
interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

const JOINT_RADIUS = 0.08; // Thicker joints
const BONE_RADIUS = 0.06;  // Thicker bones

// Mock Master Pose (Same as Skeleton for now)
const MOCK_MASTER_LANDMARKS: NormalizedLandmark[] = Array(33).fill({ x: 0, y: 0, z: 0 }).map((_, i) => {
    if (i === 11) return { x: 0.6, y: 0.2, z: 0, visibility: 1 }; // L Shoulder
    if (i === 12) return { x: 0.4, y: 0.2, z: 0, visibility: 1 }; // R Shoulder
    if (i === 13) return { x: 0.8, y: 0.2, z: 0, visibility: 1 }; // L Elbow
    if (i === 14) return { x: 0.2, y: 0.2, z: 0, visibility: 1 }; // R Elbow
    if (i === 15) return { x: 1.0, y: 0.2, z: 0, visibility: 1 }; // L Wrist
    if (i === 16) return { x: 0.0, y: 0.2, z: 0, visibility: 1 }; // R Wrist
    if (i === 23) return { x: 0.55, y: 0.5, z: 0, visibility: 1 }; // L Hip
    if (i === 24) return { x: 0.45, y: 0.5, z: 0, visibility: 1 }; // R Hip
    if (i === 25) return { x: 0.55, y: 0.8, z: 0, visibility: 1 }; // L Knee
    if (i === 26) return { x: 0.45, y: 0.8, z: 0, visibility: 1 }; // R Knee
    return { x: 0.5, y: 0.5, z: 0, visibility: 0 };
});

const BODY_PART_THICKNESS = {
  head: 0.15,
  torso: 0.12,
  arm: 0.05,
  leg: 0.07,
  default: 0.04
};

const getBoneThickness = (startIdx: number, endIdx: number) => {
  // Torso
  if ((startIdx === 11 && endIdx === 12) || (startIdx === 23 && endIdx === 24) || 
      (startIdx === 11 && endIdx === 23) || (startIdx === 12 && endIdx === 24)) return BODY_PART_THICKNESS.torso;
  // Arms
  if ([11, 12, 13, 14, 15, 16].includes(startIdx) && [13, 14, 15, 16, 17, 18, 19, 20, 21, 22].includes(endIdx)) return BODY_PART_THICKNESS.arm;
  // Legs
  if ([23, 24, 25, 26, 27, 28].includes(startIdx) && [25, 26, 27, 28, 29, 30, 31, 32].includes(endIdx)) return BODY_PART_THICKNESS.leg;
  
  return BODY_PART_THICKNESS.default;
};

const MannequinRig = ({ landmarks, color, isUser = false, opacity = 1 }: { landmarks: NormalizedLandmark[] | undefined, color: string, isUser?: boolean, opacity?: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const jointsRef = useRef<THREE.Mesh[]>([]);
  const bonesRef = useRef<THREE.Mesh[]>([]);

  useMemo(() => {
    jointsRef.current = new Array(33).fill(null);
    bonesRef.current = new Array(POSE_CONNECTIONS.length).fill(null);
  }, []);

  useFrame(() => {
    if (!landmarks) return;

    // Update Joints
    landmarks.forEach((landmark, index) => {
      const joint = jointsRef.current[index];
      if (joint) {
        // Aspect Ratio Correction (4:3)
        // Webcam is 640x480, so width is 1.33x height.
        // We map Y to range 2 (-1 to 1).
        // We should map X to range 2 * 1.33 = 2.66 (-1.33 to 1.33).
        const x = (landmark.x - 0.5) * -2.5; // Widened from -2
        const y = (1 - landmark.y) * 2 - 1;
        const z = -landmark.z * 1.0; // Reduced Z further to flatten perspective
        
        // Reduced smoothing for snappier tracking
        if (isUser) {
            joint.position.lerp(new THREE.Vector3(x, y, z), 0.8);
        } else {
            joint.position.set(x, y, z);
        }
        
        joint.visible = (landmark.visibility || 0) > 0.5;
      }
    });

    // Update Bones
    POSE_CONNECTIONS.forEach(([startIdx, endIdx], index) => {
      const bone = bonesRef.current[index];
      const startJoint = jointsRef.current[startIdx];
      const endJoint = jointsRef.current[endIdx];

      if (bone && startJoint && endJoint && startJoint.visible && endJoint.visible) {
        const start = startJoint.position;
        const end = endJoint.position;
        bone.position.copy(start).add(end).multiplyScalar(0.5);
        bone.lookAt(end);
        bone.rotateX(Math.PI / 2);
        const distance = start.distanceTo(end);
        bone.scale.set(1, distance, 1);
        bone.visible = true;
      } else if (bone) {
        bone.visible = false;
      }
    });
  });

  const materialProps = {
    color: color,
    roughness: 0.3,
    metalness: 0.6,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
    transparent: true,
    opacity: opacity,
  };

  return (
    <group ref={groupRef}>
      {/* Joints */}
      {Array.from({ length: 33 }).map((_, i) => (
        <Sphere
          key={`joint-${i}`}
          ref={(el) => { if (el) jointsRef.current[i] = el; }}
          args={[i === 0 ? 0.12 : 0.05, 32, 32]} // Head (0) is larger
        >
          <meshPhysicalMaterial {...materialProps} />
        </Sphere>
      ))}

      {/* Bones */}
      {POSE_CONNECTIONS.map(([start, end], i) => (
        <Cylinder
          key={`bone-${i}`}
          ref={(el) => { if (el) bonesRef.current[i] = el; }}
          args={[getBoneThickness(start, end), getBoneThickness(start, end), 1, 16]}
        >
           <meshPhysicalMaterial {...materialProps} />
        </Cylinder>
      ))}
    </group>
  );
};

export const UserMannequin = () => {
    const landmarks = usePoseStore((state) => state.landmarks);
    const score = usePoseStore((state) => state.score);
    
    useGradingEngine();

    // Dynamic color based on score
    // Cyan base, shifting to Green on high score, Red on low
    const color = score > 85 ? '#00FF00' : score < 50 ? '#FF0000' : '#06B6D4'; 

    return <MannequinRig landmarks={landmarks?.poseLandmarks} color={color} isUser={true} opacity={1} />;
}

export const MasterMannequin = () => {
    return <MannequinRig landmarks={MOCK_MASTER_LANDMARKS} color="#FFD700" isUser={false} opacity={0.3} />;
}

const Mannequin = () => {
  return (
    <>
      <UserMannequin />
      <MasterMannequin />
    </>
  );
};

export default Mannequin;
