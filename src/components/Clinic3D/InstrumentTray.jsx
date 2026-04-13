import React, { useState } from 'react';
import * as THREE from 'three';

/**
 * InstrumentTray — Dental instrument tray on a mobile stand
 */
export default function InstrumentTray({ onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Base with wheels */}
      <mesh position={[0, -0.4, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.08, 16]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Wheels */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(angle) * 0.3,
            -0.48,
            Math.sin(angle) * 0.3,
          ]}
          rotation={[Math.PI / 2, 0, angle]}
        >
          <cylinderGeometry args={[0.04, 0.04, 0.05, 8]} />
          <meshStandardMaterial color="#4b5563" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      {/* Pole */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.3, 8]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Tray */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.04, 0.5]} />
        <meshStandardMaterial
          color={hovered ? '#e0f2fe' : '#e5e7eb'}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>

      {/* Tray rim */}
      <mesh position={[0, 1.04, 0]}>
        <boxGeometry args={[0.72, 0.03, 0.52]} />
        <meshStandardMaterial color="#d1d5db" metalness={0.6} roughness={0.3} transparent opacity={0.5} />
      </mesh>

      {/* Simulated instruments on tray */}
      {[-0.2, -0.05, 0.1, 0.2].map((x, i) => (
        <mesh key={i} position={[x, 1.06, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.012, 0.25, 6]} />
          <meshStandardMaterial
            color={['#9ca3af', '#6b7280', '#0ea5e9', '#06d6a0'][i]}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Hover glow */}
      {hovered && (
        <pointLight position={[0, 1.2, 0.3]} color="#0ea5e9" intensity={1} distance={2} />
      )}
    </group>
  );
}
