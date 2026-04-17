import React, { useRef, useState, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * GLBModel — Generic auto-scaled GLB loader.
 *
 * Tự động:
 *  1. Đo bounding-box của model tại scale=1
 *  2. Scale để chiều cao đúng bằng targetHeight (đơn vị = 1m trong scene)
 *  3. Dịch model xuống cho đáy chạm sàn (yFloor)
 *
 * Props:
 *  modelPath    string   — URL của file GLB (encode dấu cách = %20)
 *  targetHeight number   — chiều cao mong muốn sau scale (mặc định 1.8m)
 *  yFloor       number   — trục Y mặt sàn (mặc định -0.5, khớp với ProRoom)
 *  position     [x,y,z]  — vị trí ngang (y bị override bởi auto yFloor logic)
 *  rotation     [x,y,z]  — rotation Euler (radian)
 *  onClick      fn       — callback khi click
 *  glowColor    string   — màu vòng hover
 */
const Y_FLOOR_DEFAULT = -0.5;

export default function GLBModel({
  modelPath,
  targetHeight = 1.8,
  yFloor = Y_FLOOR_DEFAULT,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onClick,
  glowColor = "#5B8DB8",
}) {
  const { scene } = useGLTF(modelPath);
  const [hovered, setHovered] = useState(false);
  const floatRef = useRef();

  /* Clone để tránh dùng chung object giữa các instance */
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  /* Auto-scale + auto y-offset: đo bbox tại scale=1, tính tỉ lệ và vị trí */
  const { s, yOffset } = useMemo(() => {
    const box  = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    box.getSize(size);

    const modelH   = size.y > 0 ? size.y : 1;
    const ratio    = targetHeight / modelH;
    // Sau khi scale, đặt đáy model = yFloor
    const bottomY  = box.min.y * ratio;
    return { s: ratio, yOffset: yFloor - bottomY };
  }, [clonedScene, targetHeight, yFloor]);

  /* Bật shadow cho từng mesh */
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow    = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  /* Float nhẹ khi hover */
  useFrame(({ clock }) => {
    if (!floatRef.current) return;
    floatRef.current.position.y = hovered
      ? Math.sin(clock.elapsedTime * 1.1) * 0.022
      : THREE.MathUtils.lerp(floatRef.current.position.y, 0, 0.08);
  });

  return (
    <group position={[position[0], yOffset, position[2]]} rotation={rotation}>
      {/* Vòng hover trên sàn */}
      {hovered && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, yFloor - yOffset + 0.02, 0]}>
          <ringGeometry args={[1.1, 1.35, 48]} />
          <meshBasicMaterial color={glowColor} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      )}

      <group
        ref={floatRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true);  document.body.style.cursor = "pointer"; }}
        onPointerOut={()   => { setHovered(false); document.body.style.cursor = "auto"; }}
        onClick={(e)       => { e.stopPropagation(); onClick?.(); }}
      >
        <primitive object={clonedScene} scale={[s, s, s]} />
      </group>
    </group>
  );
}
