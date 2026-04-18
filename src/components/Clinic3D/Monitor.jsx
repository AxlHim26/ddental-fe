import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Monitor — Clinical X-ray viewer workstation
 * Same architectural style as XRayMachine:
 * base → column (LED strip) → horizontal arm → hanging display panel
 */
export default function Monitor({ onClick }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  const body  = hovered ? '#f8fafc' : '#f0f4f8';
  const metal = '#8fa3b1';
  const glow  = hovered ? '#0ea5e9' : '#1e3a5f';
  const glowInt = hovered ? 1.5 : 0.5;

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = 'pointer'; }}
      onPointerOut={()  => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e)      => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* ── BASE (same rect style as XRayMachine) ── */}
      <mesh position={[0, -0.42, 0]} castShadow>
        <boxGeometry args={[0.90, 0.14, 0.65]} />
        <meshStandardMaterial color={metal} metalness={0.65} roughness={0.28} />
      </mesh>
      {/* Base feet */}
      {[[-0.32, 0.24], [0.32, 0.24], [-0.32, -0.24], [0.32, -0.24]].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.51, z]} castShadow>
          <cylinderGeometry args={[0.05, 0.065, 0.07, 8]} />
          <meshStandardMaterial color="#374151" roughness={0.9} />
        </mesh>
      ))}

      {/* ── MAIN COLUMN ── */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[0.26, 3.94, 0.24]} />
        <meshStandardMaterial color={body} roughness={0.3} metalness={0.05} />
      </mesh>
      {/* LED accent strip (same as XRayMachine) */}
      <mesh position={[0.14, 1.55, 0]}>
        <boxGeometry args={[0.013, 3.94, 0.018]} />
        <meshStandardMaterial
          color="#0ea5e9" emissive="#0ea5e9"
          emissiveIntensity={hovered ? 3 : 0.7}
        />
      </mesh>

      {/* ── TOP HORIZONTAL BRIDGE ARM ── */}
      <mesh position={[0.7, 3.55, 0]} castShadow>
        <boxGeometry args={[1.4, 0.20, 0.20]} />
        <meshStandardMaterial color={body} roughness={0.28} />
      </mesh>
      {/* Arm end joint */}
      <mesh position={[1.4, 3.55, 0]} castShadow>
        <boxGeometry args={[0.24, 0.28, 0.24]} />
        <meshStandardMaterial color={metal} metalness={0.55} roughness={0.3} />
      </mesh>

      {/* ── VERTICAL DROP ARM (screen hangs from end) ── */}
      <mesh position={[1.4, 2.6, 0]} castShadow>
        <boxGeometry args={[0.20, 1.7, 0.20]} />
        <meshStandardMaterial color={body} roughness={0.3} />
      </mesh>
      {/* Screen mount bracket */}
      <mesh position={[1.4, 1.65, 0]} castShadow>
        <boxGeometry args={[0.28, 0.22, 0.28]} />
        <meshStandardMaterial color={metal} metalness={0.6} roughness={0.25} />
      </mesh>

      {/* ── LARGE DISPLAY SCREEN ── */}
      {/* Bezel */}
      <mesh position={[1.4, 0.72, 0.15]} castShadow>
        <boxGeometry args={[1.10, 0.82, 0.055]} />
        <meshStandardMaterial color="#1e293b" roughness={0.25} metalness={0.45} />
      </mesh>
      {/* Display panel */}
      <mesh position={[1.4, 0.73, 0.178]}>
        <planeGeometry args={[0.96, 0.68]} />
        <meshStandardMaterial
          color="#040d18"
          emissive={glow}
          emissiveIntensity={glowInt}
        />
      </mesh>
      {/* Simulated X-ray UI lines on screen */}
      {[0.20, 0.07, -0.06, -0.18, -0.28].map((y, i) => (
        <mesh key={i} position={[1.4 + (i % 2 === 0 ? -0.05 : 0.08), 0.73 + y, 0.182]}>
          <boxGeometry args={[0.48 - i * 0.05, 0.018, 0.001]} />
          <meshStandardMaterial
            color="#0ea5e9" emissive="#0ea5e9"
            emissiveIntensity={hovered ? 1.2 : 0.25}
            transparent opacity={0.65 - i * 0.08}
          />
        </mesh>
      ))}
      {/* Simulated X-ray image box */}
      <mesh position={[1.62, 0.82, 0.182]}>
        <planeGeometry args={[0.28, 0.22]} />
        <meshStandardMaterial
          color="#0d2035" emissive="#1e3a5f"
          emissiveIntensity={hovered ? 0.9 : 0.2}
          transparent opacity={0.8}
        />
      </mesh>

      {/* ── POWER LED (bottom right of bezel) ── */}
      <mesh position={[1.88, 0.32, 0.180]}>
        <circleGeometry args={[0.017, 12]} />
        <meshStandardMaterial
          color="#22c55e" emissive="#22c55e"
          emissiveIntensity={hovered ? 5 : 2}
        />
      </mesh>

      {/* ── STATUS LED strip (column top, same as XRayMachine) ── */}
      <mesh position={[0, 3.57, 0.13]}>
        <boxGeometry args={[0.18, 0.028, 0.01]} />
        <meshStandardMaterial
          color="#22c55e" emissive="#22c55e"
          emissiveIntensity={hovered ? 5 : 1.5}
        />
      </mesh>

      {/* ── HOVER POINT LIGHT ── */}
      {hovered && (
        <pointLight position={[1.4, 0.8, 0.5]} color="#0ea5e9" intensity={2} distance={3.5} />
      )}
    </group>
  );
}
