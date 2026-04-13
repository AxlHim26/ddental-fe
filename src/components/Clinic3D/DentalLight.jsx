import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * DentalLight — Overhead dental operating light
 * Arm extending from ceiling/post with adjustable lamp head
 */
export default function DentalLight({ onClick }) {
  const groupRef = useRef();
  const lightRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Subtle swing animation
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  const metalColor = '#f8fafc'; // White plastic look

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Ceiling mount */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 16]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Vertical arm */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Horizontal arm */}
      <group ref={lightRef}>
        <mesh position={[0, 0.5, 0.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
          <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Joint */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#9ca3af" metalness={0.9} roughness={0.1} />
        </mesh>

        {/* Lamp head */}
        <mesh position={[0, 0.35, 1.2]} rotation={[0.3, 0, 0]} castShadow>
          <cylinderGeometry args={[0.35, 0.25, 0.15, 32]} />
          <meshStandardMaterial 
            color={hovered ? '#6ee7b7' : metalColor} 
            metalness={0.1} 
            roughness={0.6} 
          />
        </mesh>

        {/* Light emitter surface */}
        <mesh position={[0, 0.26, 1.2]} rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
          <circleGeometry args={[0.3, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={hovered ? '#10b981' : '#fef3c7'}
            emissiveIntensity={hovered ? 2 : 1}
          />
        </mesh>

        {/* Spotlight from lamp */}
        <spotLight
          position={[0, 0.25, 1.2]}
          target-position={[0, -2, 1.5]}
          angle={0.5}
          penumbra={0.5}
          intensity={hovered ? 3 : 1.5}
          color={hovered ? '#bae6fd' : '#fefce8'}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
      </group>

      {/* Glow ring when hovered */}
      {hovered && (
        <mesh position={[0, 0.28, 1.2]} rotation={[-Math.PI / 2 + 0.3, 0, 0]}>
          <ringGeometry args={[0.32, 0.45, 32]} />
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
