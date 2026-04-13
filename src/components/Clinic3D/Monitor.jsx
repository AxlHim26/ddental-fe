import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Monitor — Medical display screen mounted on an arm
 */
export default function Monitor({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Stand pole */}
      <mesh position={[0, -0.8, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.5, 8]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Stand base */}
      <mesh position={[0, -1.55, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.1, 16]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Screen bezel */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.4, 0.9, 0.06]} />
        <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Screen display */}
      <mesh position={[0, 0, 0.035]}>
        <planeGeometry args={[1.25, 0.75]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive={hovered ? '#0ea5e9' : '#1e3a5f'}
          emissiveIntensity={hovered ? 1.2 : 0.6}
        />
      </mesh>

      {/* Screen content lines (simulated UI) */}
      {[0.2, 0.05, -0.1, -0.25].map((y, i) => (
        <mesh key={i} position={[-0.15, y, 0.04]}>
          <boxGeometry args={[0.6 - i * 0.1, 0.03, 0.001]} />
          <meshStandardMaterial
            color="#0ea5e9"
            emissive="#0ea5e9"
            emissiveIntensity={hovered ? 1.5 : 0.4}
            transparent
            opacity={0.6 - i * 0.1}
          />
        </mesh>
      ))}

      {/* Power LED */}
      <mesh position={[0.55, -0.38, 0.035]}>
        <circleGeometry args={[0.02, 16]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={2}
        />
      </mesh>

      {/* Hover glow */}
      {hovered && (
        <pointLight position={[0, 0, 0.5]} color="#0ea5e9" intensity={1} distance={2.5} />
      )}
    </group>
  );
}
