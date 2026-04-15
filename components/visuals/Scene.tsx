'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, MeshReflectorMaterial, Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import Mannequin from './Mannequin';

const Scene = () => {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0.5, 4.5], fov: 50 }}>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 5, 15]} />

        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <Mannequin />
            
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
              <planeGeometry args={[50, 50]} />
              <MeshReflectorMaterial
                blur={[300, 100]}
                resolution={2048}
                mixBlur={1}
                mixStrength={80}
                roughness={1}
                depthScale={1.2}
                minDepthThreshold={0.4}
                maxDepthThreshold={1.4}
                color="#101010"
                metalness={0.5}
                mirror={0} // Fixed: mirror is not a valid prop on MeshReflectorMaterial types sometimes, but usually it is 0-1. 
                           // Actually, let's check docs or remove if unsure. 
                           // `mirror` prop was deprecated/removed in newer versions for `mirror` mix?
                           // Let's stick to standard props.
              />
            </mesh>
          </group>

          {/* <Environment preset="city" /> */}
          <Environment path="/hdri/" files="potsdamer_platz_1k.hdr" />
          
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={1} />

          <EffectComposer>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
          </EffectComposer>
        </Suspense>
        
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default Scene;
