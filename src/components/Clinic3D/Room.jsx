import React, { useRef } from 'react';
import { useTexture } from '@react-three/drei';

/**
 * Room — Clinic room geometry: floor, walls, ceiling
 * Creates a bright, airy medical room with glass partitions and two-tone walls.
 */
export default function Room() {
  const floorRef = useRef();

  return (
    <group>
      {/* Floor — Grey marble-like reflective tile */}
      <mesh
        ref={floorRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 30]} />
        <meshStandardMaterial
          color="#94a3b8" /* light slate grey */
          roughness={0.1}
          metalness={0.4}
          envMapIntensity={1}
        />
      </mesh>

      {/* === WALLS === */}
      {/* Back wall (Main) */}
      <mesh position={[0, 3.5, -15]} receiveShadow>
        <planeGeometry args={[20, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>

      {/* Back wall (Lower Teal panel) */}
      <mesh position={[0, 0.75, -14.99]} receiveShadow>
        <planeGeometry args={[20, 2.5]} />
        <meshStandardMaterial color="#5eead4" roughness={0.4} /> {/* Teal */}
      </mesh>

      {/* Left wall (Main) */}
      <mesh position={[-10, 3.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>

      {/* Left wall (Lower Teal panel) */}
      <mesh position={[-9.99, 0.75, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 2.5]} />
        <meshStandardMaterial color="#5eead4" roughness={0.4} />
      </mesh>

      {/* Right wall (Main) */}
      <mesh position={[10, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.6} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 7.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 30]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.9} />
      </mesh>

      {/* Ceiling recess lighting stripes */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[-5, 7.49, 0]}>
        <planeGeometry args={[0.5, 30]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[5, 7.49, 0]}>
        <planeGeometry args={[0.5, 30]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2} />
      </mesh>

      {/* Baseboard trim */}
      <mesh position={[0, -0.4, -14.98]}>
        <boxGeometry args={[20, 0.2, 0.05]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
      </mesh>

      {/* === GLASS PARTITIONS === */}
      {/* Divider 1 */}
      <group position={[-5, 1.5, -5]}>
        {/* Metal frame */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[10, 4, 0.1]} />
          <meshPhysicalMaterial
            transmission={0.9}
            opacity={1}
            roughness={0.1}
            ior={1.5}
            thickness={0.5}
            color="#e0f2fe"
          />
        </mesh>
        <mesh position={[5, 0, 0]}>
          <boxGeometry args={[0.1, 4, 0.2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[10, 0.1, 0.2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>

      {/* Divider 2 */}
      <group position={[-5, 1.5, 5]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[10, 4, 0.1]} />
          <meshPhysicalMaterial
            transmission={0.9}
            opacity={1}
            roughness={0.1}
            ior={1.5}
            thickness={0.5}
            color="#e0f2fe"
          />
        </mesh>
        <mesh position={[5, 0, 0]}>
          <boxGeometry args={[0.1, 4, 0.2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[10, 0.1, 0.2]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} />
        </mesh>
      </group>

      {/* Wall Posters */}
      <group position={[-9.98, 3.5, 0]}>
         {/* Poster 1 */}
         <mesh position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
            <boxGeometry args={[3, 2, 0.05]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
         </mesh>
         <mesh position={[0.03, 0, 0]} rotation={[0, Math.PI/2, 0]}>
            <planeGeometry args={[2.8, 1.8]} />
            <meshStandardMaterial color="#0284c7" emissive="#0ea5e9" emissiveIntensity={0.2} />
         </mesh>
      </group>

      <group position={[-9.98, 3.5, -10]}>
         {/* Poster 2 */}
         <mesh position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
            <boxGeometry args={[3, 2, 0.05]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
         </mesh>
         <mesh position={[0.03, 0, 0]} rotation={[0, Math.PI/2, 0]}>
            <planeGeometry args={[2.8, 1.8]} />
            <meshStandardMaterial color="#059669" emissive="#10b981" emissiveIntensity={0.2} />
         </mesh>
      </group>

      <group position={[-9.98, 3.5, 10]}>
         {/* Poster 3 */}
         <mesh position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
            <boxGeometry args={[3, 2, 0.05]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.3} />
         </mesh>
         <mesh position={[0.03, 0, 0]} rotation={[0, Math.PI/2, 0]}>
            <planeGeometry args={[2.8, 1.8]} />
            <meshStandardMaterial color="#7c3aed" emissive="#8b5cf6" emissiveIntensity={0.2} />
         </mesh>
      </group>

    </group>
  );
}
