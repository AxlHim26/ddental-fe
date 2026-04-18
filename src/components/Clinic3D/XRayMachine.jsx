import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Clone } from '@react-three/drei';
import * as THREE from 'three';

/**
 * XRayMachine — Loaded from a GLB/GLTF model
 * Replaces primitive shapes with a real 3D asset.
 */
export default function XRayMachine({ onClick, modelPath, scale = 1, rotation = [0, 0, 0], position = [0, 0, 0] }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Default to Planmeca X-Ray
  const path = modelPath || '/Models/may x-quang planmeca.glb';
  const { scene } = useGLTF(path);

  // Tự động chuẩn hóa kích thước (Normalize scale)
  const computedScale = useMemo(() => {
    try {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim === 0) return scale;
      // Thông thường máy X-Quang cao khoảng 2.2m
      const targetSize = 2.2;
      return (targetSize / maxDim) * scale;
    } catch(e) {
      return scale;
    }
  }, [scene, scale]);

  // Gentle floating when hovered
  useFrame((state) => {
    if (groupRef.current && hovered) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    } else if (groupRef.current) {
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.05);
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
    >
      {/* 3D Model Rendered Here */}
      <Clone 
        object={scene} 
        scale={computedScale} 
        rotation={rotation} 
        position={position}
        castShadow 
        receiveShadow 
      />

      {/* Hover Light Highlight */}
      {hovered && (
        <pointLight position={[0, 2, 1]} color="#0ea5e9" intensity={3} distance={4} />
      )}
    </group>
  );
}

// Preload models for faster rendering
useGLTF.preload('/Models/may x-quang planmeca.glb');
useGLTF.preload('/Models/chan doan hinh anh vatech.glb');
