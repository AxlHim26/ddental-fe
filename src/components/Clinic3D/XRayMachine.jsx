import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * XRayMachine — Standing X-Ray machine with arm and sensor panel
 */
export default function XRayMachine({ onClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Subtle pulse on the screen
  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.children.forEach(child => {
        if (child.userData.isScreen) {
          child.material.emissiveIntensity = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
        }
      });
    }
  });

  const bodyColor = '#e5e7eb';
  const accentColor = hovered ? '#0ea5e9' : '#64748b';

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Base */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1.2, 0.3, 0.8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main column */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.3, 3.5, 0.3]} />
        <meshStandardMaterial color={bodyColor} roughness={0.5} />
      </mesh>

      {/* Top housing */}
      <mesh position={[0, 3.3, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.5]} />
        <meshStandardMaterial color={bodyColor} roughness={0.4} />
      </mesh>

      {/* X-Ray arm (horizontal) */}
      <mesh position={[0.8, 3.3, 0]} castShadow>
        <boxGeometry args={[1.2, 0.15, 0.15]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* X-Ray cone/emitter */}
      <mesh position={[1.4, 3.0, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.08, 0.18, 0.5, 16]} />
        <meshStandardMaterial color={accentColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Control panel / screen */}
      <mesh position={[0, 2.2, 0.2]} userData={{ isScreen: true }} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.05]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive={hovered ? '#0ea5e9' : '#334155'}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Accent strip */}
      <mesh position={[0, 0.8, 0.16]}>
        <boxGeometry args={[0.32, 0.04, 0.01]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#0ea5e9"
          emissiveIntensity={hovered ? 1.5 : 0.5}
        />
      </mesh>

      {/* Glow when hovered */}
      {hovered && (
        <pointLight position={[0, 2, 0.5]} color="#0ea5e9" intensity={2} distance={3} />
      )}
    </group>
  );
}
