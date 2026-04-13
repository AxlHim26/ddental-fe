import React, { useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * WaitingLounge — A sleek, modern sofa and coffee table for the entrance.
 */
export default function WaitingLounge({ onClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const sofaColor = hovered ? '#a7f3d0' : '#f1f5f9'; // Mint on hover, white default
  const woodColor = '#94a3b8';

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* 3-Seater Sofa base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[4.5, 0.4, 1.2]} />
        <meshStandardMaterial color={sofaColor} roughness={0.8} />
      </mesh>

      {/* Sofa backrest */}
      <mesh position={[0, 0.7, -0.4]} castShadow>
        <boxGeometry args={[4.5, 0.8, 0.4]} />
        <meshStandardMaterial color={sofaColor} roughness={0.8} />
      </mesh>

      {/* Sofa armrests */}
      <mesh position={[-2.35, 0.6, 0]} castShadow>
        <boxGeometry args={[0.3, 0.8, 1.2]} />
        <meshStandardMaterial color={sofaColor} roughness={0.8} />
      </mesh>
      <mesh position={[2.35, 0.6, 0]} castShadow>
        <boxGeometry args={[0.3, 0.8, 1.2]} />
        <meshStandardMaterial color={sofaColor} roughness={0.8} />
      </mesh>

      {/* Coffee Table */}
      <group position={[0, 0, 1.5]}>
        {/* Table top */}
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[2.5, 0.05, 1.2]} />
          <meshPhysicalMaterial 
            transmission={0.8} 
            opacity={1} 
            roughness={0.1} 
            thickness={0.1} 
            color="#e0f2fe" 
          />
        </mesh>
        
        {/* Table legs */}
        {[[-1.1, -0.4], [1.1, -0.4], [-1.1, 0.4], [1.1, 0.4]].map((pos, i) => (
          <mesh key={i} position={[pos[0], 0.2, pos[1]]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
            <meshStandardMaterial color="#9ca3af" metalness={0.8} />
          </mesh>
        ))}

        {/* Magazines/Books */}
        <mesh position={[-0.5, 0.45, 0]} rotation={[0, 0.2, 0]}>
          <boxGeometry args={[0.4, 0.05, 0.3]} />
          <meshStandardMaterial color="#0ea5e9" />
        </mesh>
        <mesh position={[-0.4, 0.48, 0.1]} rotation={[0, 0.4, 0]}>
          <boxGeometry args={[0.4, 0.03, 0.3]} />
          <meshStandardMaterial color="#10b981" />
        </mesh>
      </group>

      {hovered && (
        <mesh position={[0, 0.05, 1.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 1.8, 32]} />
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
