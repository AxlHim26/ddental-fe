import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * MedicalCart — A rolling cart with an IV drip and ECG Monitor.
 */
export default function MedicalCart({ onClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const metalColor = '#cbd5e1';
  const accentColor = hovered ? '#38bdf8' : '#e0f2fe';

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* Base with wheels */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.8, 0.05, 0.6]} />
        <meshStandardMaterial color={metalColor} />
      </mesh>
      
      {/* 4 Wheels */}
      {[[-0.35, -0.25], [0.35, -0.25], [-0.35, 0.25], [0.35, 0.25]].map((pos, idx) => (
        <mesh key={idx} position={[pos[0], 0.025, pos[1]]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.04]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
      ))}

      {/* Main cart body/cabinet */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.7, 0.7, 0.5]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Drawers */}
      {[0.25, 0.45, 0.65].map((y, idx) => (
        <mesh key={`drawer-${idx}`} position={[0, y, 0.26]}>
          <boxGeometry args={[0.6, 0.15, 0.02]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>
      ))}

      {/* IV Pole */}
      <mesh position={[-0.3, 1.2, -0.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 1.5]} />
        <meshStandardMaterial color={metalColor} metalness={0.9} />
      </mesh>

      {/* IV Bag */}
      <mesh position={[-0.3, 1.8, -0.1]} castShadow>
        <boxGeometry args={[0.1, 0.15, 0.05]} />
        <meshPhysicalMaterial 
          transmission={0.9} 
          opacity={1} 
          roughness={0} 
          ior={1.3} 
          thickness={0.05} 
          color="#e0f2fe" 
        />
      </mesh>

      {/* ECG Monitor on top */}
      <group position={[0, 0.95, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.3, 0.1]} />
          <meshStandardMaterial color="#f1f5f9" />
        </mesh>
        
        {/* Screen */}
        <mesh position={[0, 0, 0.06]}>
          <planeGeometry args={[0.45, 0.25]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>

        {/* ECG Line (simple visual) */}
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[0.4, 0.02]} />
          <meshStandardMaterial color="#2dd4bf" emissive="#14b8a6" emissiveIntensity={1} />
        </mesh>
      </group>

      {/* Glow halo when hovered */}
      {hovered && (
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.9, 32]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
