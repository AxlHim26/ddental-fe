import React, { useState } from 'react';
import * as THREE from 'three';

/**
 * Cabinet — Medical instrument storage cabinet
 */
export default function Cabinet({ onClick }) {
  const [hovered, setHovered] = useState(false);

  const cabinetColor = '#f1f5f9';
  const handleColor = '#9ca3af';

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); if (onClick) { setHovered(true); document.body.style.cursor = 'pointer'; } }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Main cabinet body */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2.0, 3.0, 0.8]} />
        <meshStandardMaterial
          color={hovered ? '#e0f2fe' : cabinetColor}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Door line (left door) */}
      <mesh position={[-0.01, 1.5, 0.41]}>
        <boxGeometry args={[0.01, 2.8, 0.01]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Left door handle */}
      <mesh position={[-0.15, 1.8, 0.42]} castShadow>
        <boxGeometry args={[0.04, 0.3, 0.05]} />
        <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Right door handle */}
      <mesh position={[0.15, 1.8, 0.42]} castShadow>
        <boxGeometry args={[0.04, 0.3, 0.05]} />
        <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Top shelf (glass) */}
      <mesh position={[0, 2.8, 0]}>
        <boxGeometry args={[1.9, 0.03, 0.7]} />
        <meshStandardMaterial
          color="#bae6fd"
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Middle shelf */}
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[1.9, 0.03, 0.7]} />
        <meshStandardMaterial
          color="#bae6fd"
          transparent
          opacity={0.3}
          metalness={0.5}
          roughness={0.1}
        />
      </mesh>

      {/* Bottom drawer section */}
      <mesh position={[0, 0.35, 0.41]}>
        <boxGeometry args={[1.9, 0.02, 0.01]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      <mesh position={[0, 0.65, 0.41]}>
        <boxGeometry args={[1.9, 0.02, 0.01]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Drawer handles */}
      <mesh position={[0, 0.5, 0.43]}>
        <boxGeometry args={[0.3, 0.03, 0.04]} />
        <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.2, 0.43]}>
        <boxGeometry args={[0.3, 0.03, 0.04]} />
        <meshStandardMaterial color={handleColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* LED accent strip */}
      <mesh position={[0, 3.01, 0.3]}>
        <boxGeometry args={[1.8, 0.02, 0.01]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#0ea5e9"
          emissiveIntensity={hovered ? 2 : 0.5}
        />
      </mesh>

      {/* Hover glow — only when interactive */}
      {hovered && onClick && (
        <pointLight position={[0, 1.5, 1]} color="#0ea5e9" intensity={1.5} distance={3} />
      )}
    </group>
  );
}
