import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * DentistStool — A small rolling stool for the dentist.
 */
export default function DentistStool({ onClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const metalColor = '#cbd5e1';
  const cushionColor = hovered ? '#6ee7b7' : '#a7f3d0'; // Mint green
  const baseColor = '#f8fafc';

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* 5-star base */}
      {[0, 1, 2, 3, 4].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]}>
          <mesh position={[0.3, 0.1, 0]} castShadow>
            <boxGeometry args={[0.6, 0.05, 0.08]} />
            <meshStandardMaterial color={baseColor} />
          </mesh>
          {/* Wheel */}
          <mesh position={[0.55, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 16]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </group>
      ))}

      {/* Center column */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 0.4, 16]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} />
      </mesh>

      {/* Seat cushion */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} />
        <meshStandardMaterial color={cushionColor} roughness={0.8} />
      </mesh>

      {/* Backrest support arm */}
      <mesh position={[0, 0.7, -0.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.05, 0.4, 0.02]} />
        <meshStandardMaterial color={baseColor} />
      </mesh>

      {/* Backrest */}
      <mesh position={[0, 0.9, -0.25]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 0.15, 0.08]} />
        <meshStandardMaterial color={cushionColor} roughness={0.8} />
      </mesh>

      {/* Glow halo when hovered */}
      {hovered && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 32]} />
          <meshBasicMaterial
            color="#10b981"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
