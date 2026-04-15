import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Trail, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { usePoseStore } from '@/store/poseStore';
import { useGradingEngine } from '@/hooks/useGradingEngine';

// MediaPipe Pose landmark connections (standard skeleton structure)
export const POSE_CONNECTIONS: [number, number][] = [
  // Face
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8], [9, 10],
  // Torso
  [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21], [17, 19],
  [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  [11, 23], [12, 24], [23, 24],
  // Legs
  [23, 25], [25, 27], [27, 29], [29, 31], [27, 31],
  [24, 26], [26, 28], [28, 30], [30, 32], [28, 32]
];

interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

const JOINT_RADIUS = 0.05;
const BONE_RADIUS = 0.02;

// Mock Master Pose (T-Poseish)
// We need 33 landmarks.
// 11, 12 shoulders. 13, 14 elbows. 15, 16 wrists.
// 23, 24 hips. 25, 26 knees. 27, 28 ankles.
const MOCK_MASTER_LANDMARKS: NormalizedLandmark[] = Array(33).fill({ x: 0, y: 0, z: 0 }).map((_, i) => {
    // Very rough T-pose approximation for visualization
    // Center is roughly 0.5, 0.5
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
    return { x: 0.5, y: 0.5, z: 0, visibility: 0 }; // Others hidden/center
});


const SkeletonRig = ({ landmarks, color, isUser = false }: { landmarks: NormalizedLandmark[] | undefined, color: string, isUser?: boolean }) => {
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
        const x = (landmark.x - 0.5) * -2;
        const y = (1 - landmark.y) * 2 - 1;
        const z = -landmark.z * 2;
        joint.position.set(x, y, z);
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

  return (
    <group ref={groupRef}>
      {Array.from({ length: 33 }).map((_, i) => (
        <Sphere
          key={`joint-${i}`}
          ref={(el) => { if (el) jointsRef.current[i] = el; }}
          args={[JOINT_RADIUS, 16, 16]}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isUser ? 2 : 0.5}
            roughness={0.1}
            metalness={0.8}
            transparent={!isUser}
            opacity={isUser ? 1 : 0.3}
          />
        </Sphere>
      ))}

      {POSE_CONNECTIONS.map(([start, end], i) => (
        <Cylinder
          key={`bone-${i}`}
          ref={(el) => { if (el) bonesRef.current[i] = el; }}
          args={[BONE_RADIUS, BONE_RADIUS, 1, 8]}
        >
           <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isUser ? 1.5 : 0.2}
            transparent
            opacity={isUser ? 0.8 : 0.2}
          />
        </Cylinder>
      ))}
      
      {isUser && (
          <>
            {/* Trail for Left Hand (15) - We need to track the position. 
                Since we update imperatively, we can't easily attach Trail to the ref directly in JSX 
                unless we wrap it. 
                Let's use a helper component that follows the joint.
            */}
             {/* Simplified: Just wrapping the whole group for now or skipping specific trails to avoid complexity 
                 with imperative updates + declarative Trails. 
                 Actually, Trail works by tracking a ref's position. 
                 If we pass the joint ref to Trail, it might work.
             */}
          </>
      )}
    </group>
  );
};

const UserSkeleton = () => {
    const landmarks = usePoseStore((state) => state.landmarks);
    const score = usePoseStore((state) => state.score);
    
    // Run grading engine
    useGradingEngine();

    // Color based on score
    // > 90% Green, < 70% Red (for misaligned limbs - logic is in grading engine but we need per-limb color? 
    // The requirement said "Turn the user's 3D Skeleton Green".
    // Let's just change the whole skeleton color for now.
    const color = score > 90 ? '#00FF00' : '#00FFFF'; // Green or Cyan

    return <SkeletonRig landmarks={landmarks?.poseLandmarks} color={color} isUser={true} />;
}

const MasterSkeleton = () => {
    return <SkeletonRig landmarks={MOCK_MASTER_LANDMARKS} color="#FFD700" isUser={false} />;
}

const Skeleton = () => {
  return (
    <>
      <UserSkeleton />
      <MasterSkeleton />
    </>
  );
};

export default Skeleton;
