"use client";

import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "../../lib/productData";
import ProRoom from "./ProRoom";
import ProProductModal from "./ProProductModal";
import GLBModel from "./GLBModel";
import { ProReceptionDesk, ProWaitingChair, ProStorageCabinet } from "./ProEquipment";
import {
  DoctorDesk, WallCounter, InstrumentCart,
  PrivacyCurtain, PlantDecor, LeadScreen,
  ControlConsole, CoffeeTable, SmallCabinet,
} from "./ClinicFurniture";

/* ─── Model paths ─── */
const M = {
  chair1:   "/models/ghe%20nha%20khoa.glb",
  chair2:   "/models/ghe%20nha%20khoa%203.glb",
  vatech:   "/models/chan%20doan%20hinh%20anh%20vatech.glb",
  planmeca: "/models/may%20x-quang%20planmeca.glb",
};
Object.values(M).forEach(useGLTF.preload);

/* ─── Loader ─── */
function Loader() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1419] z-20 pointer-events-none">
      <div className="relative w-14 h-14 mb-5">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute inset-2 rounded-full border border-primary/10 border-b-primary/60 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "1.6s" }} />
      </div>
      <p className="text-white/35 text-[10px] font-bold tracking-[0.3em] uppercase">Đang tải phòng khám 3D…</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SCENE LAYOUT (tất cả vị trí được căn theo trung tâm từng phòng)

   Room zones (ProRoom.jsx):
     Reception  : z  4 → 11   (width 20)
     Treat-1 (L): x -10 → 0,  z -4 → 4
     Treat-2 (R): x   0 → 10, z -4 → 4
     Imaging    : z -13 → -4  (width 20)

   Nguyên tắc bố trí:
     • Ghế nha khoa = TRUNG TÂM phòng điều trị
     • Thiết bị phụ đặt ≤2m xung quanh ghế
     • Máy X-quang = trung tâm phòng chẩn đoán (sát tường)
     • Ghế chờ = hàng sát tường trái
═══════════════════════════════════════════════════════ */
function ShowroomScene({ onSelectProduct }) {
  return (
    <>
      <color attach="background" args={["#0B1419"]} />
      <fog attach="fog" args={["#0B1419", 28, 56]} />
      <ambientLight intensity={0.28} color="#EEF4FA" />

      {/* Key light */}
      <directionalLight position={[4, 14, 6]} intensity={1.05} color="#FAF8F2" castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048}
        shadow-camera-near={0.5} shadow-camera-far={62}
        shadow-camera-left={-22} shadow-camera-right={22}
        shadow-camera-top={22} shadow-camera-bottom={-22}
        shadow-bias={-0.0003} />
      <directionalLight position={[-10, 6, 2]}  intensity={0.34} color="#D0E8F5" />
      <directionalLight position={[ 0,  3, 16]}  intensity={0.18} color="#E8F4FF" />

      {/* Room point lights */}
      {[ /* reception */ [-5,5.2,7.5],[0,5.2,7.5],[5,5.2,7.5],
         /* treat-1 */ [-7,5.2,0],[-3,5.2,0],
         /* treat-2 */ [3,5.2,0],[7,5.2,0],
         /* imaging  */ [-6,5.2,-8.5],[0,5.2,-8.5],[6,5.2,-8.5],
      ].map(([x,y,z],i)=>(
        <pointLight key={i} position={[x,y,z]}
          intensity={i<3?0.6:i<7?0.75:0.9}
          color={i>=7?"#EEF4FF":"#FFFDF5"}
          distance={13} decay={2}/>
      ))}

      <Suspense fallback={null}>
        <Environment preset="apartment" background={false} />
        <ProRoom />

        {/* ══════════════════════════════════════════
            PHÒNG ĐIỀU TRỊ 1  (x: -10→0, z: -4→4)
            Trung tâm: ghế nha khoa tại (-5, 0, -0.5)
            Hướng ghế: bệnh nhân nằm với đầu về phía tường trái (-X)
        ══════════════════════════════════════════ */}

        {/* ► TRUNG TÂM: Ghế nha khoa 1 */}
        <GLBModel modelPath={M.chair1} targetHeight={2.5}
          position={[-5, 0, -0.5]} rotation={[0, Math.PI / 2, 0]}
          glowColor="#4DB6AC"
          onClick={() => onSelectProduct("ghe-grace-x2")} />

        {/* Xe dụng cụ — sát bên phải ghế (phía bác sĩ) */}
        <InstrumentCart position={[-3.4, 0, -0.5]} rotation={[0, -Math.PI / 2, 0]} />

        {/* Quầy công tác — sát tường trái, dọc theo tường */}
        <WallCounter position={[-9.6, 0, 0]} rotation={[0, Math.PI / 2, 0]} length={4.0} />

        {/* Bàn bác sĩ — góc trước-trái (gần lối ra) */}
        <DoctorDesk position={[-8.2, 0, 3.0]} rotation={[0, 0, 0]} />

        {/* Tủ thuốc treo tường — trên quầy */}
        <SmallCabinet position={[-9.55, 1.82, 1.6]} rotation={[0, Math.PI / 2, 0]} />

        {/* Rèm che — ngăn góc ghế với cửa ra vào (tạo privacy) */}
        <PrivacyCurtain position={[-5.0, 0, -3.2]} rotation={[0, Math.PI / 2, 0]} width={2.8} height={2.55} />

        {/* Storage cabinet bên phòng điều trị 1 */}
        <ProStorageCabinet position={[-9.5, 0, -2.8]} rotation={[0, Math.PI / 2, 0]}
          onClick={() => onSelectProduct("sensor-rvg")} />


        {/* ══════════════════════════════════════════
            PHÒNG ĐIỀU TRỊ 2  (x: 0→10, z: -4→4)
            Trung tâm: ghế nha khoa tại (5, 0, -0.5)
            +  VATECH sát tường phải phía sau (combo phòng)
        ══════════════════════════════════════════ */}

        {/* ► TRUNG TÂM: Ghế nha khoa 2 (đối xứng phòng 1) */}
        <GLBModel modelPath={M.chair2} targetHeight={2.5}
          position={[5, 0, -0.5]} rotation={[0, -Math.PI / 2, 0]}
          glowColor="#4DB6AC"
          onClick={() => onSelectProduct("ghe-anthos-a3")} />

        {/* Xe dụng cụ — sát bên trái ghế */}
        <InstrumentCart position={[3.4, 0, -0.5]} rotation={[0, Math.PI / 2, 0]} />

        {/* ► MÁY CBCT VATECH — sát tường phải, góc sau-phải */}
        <GLBModel modelPath={M.vatech} targetHeight={2.4}
          position={[8.5, 0, -2.8]} rotation={[0, -Math.PI * 0.55, 0]}
          glowColor="#90CAF9"
          onClick={() => onSelectProduct("xray-pax-i3d")} />

        {/* Rèm che — ngăn VATECH với khu ghế (tạo sub-zone) */}
        <PrivacyCurtain position={[5.0, 0, -2.0]} rotation={[0, 0, 0]} width={2.5} height={2.55} />

        {/* Quầy công tác — sát tường phải, đoạn phía trước */}
        <WallCounter position={[9.6, 0, 1.8]} rotation={[0, -Math.PI / 2, 0]} length={3.2} />

        {/* Bàn bác sĩ — góc trước-phải */}
        <DoctorDesk position={[8.0, 0, 3.2]} rotation={[0, Math.PI, 0]} />

        {/* Tủ thuốc treo tường */}
        <SmallCabinet position={[9.55, 1.82, -1.2]} rotation={[0, -Math.PI / 2, 0]} />


        {/* ══════════════════════════════════════════
            PHÒNG CHẨN ĐOÁN - X-QUANG  (z: -13→-4)
            ┌─────────────────────────┬──────────────┐
            │ LEFT: Ghế điều trị      │ RIGHT: Xquang│
            │ + InstrCart + DeskBác sĩ│ Planmeca sát │
            │ WallCounter (tường trái)│ tường phải   │
            │  ─────── LeadScreen ───────────────── │
            │ ControlConsole + WallCounter (tường sau│
            └─────────────────────────┴──────────────┘
        ══════════════════════════════════════════ */}

        {/* ► GHẾ NHA KHOA — trung tâm nửa trái phòng */}
        <GLBModel modelPath={M.chair2} targetHeight={2.5}
          position={[-4.5, 0, -8.5]} rotation={[0, Math.PI / 2, 0]}
          glowColor="#4DB6AC"
          onClick={() => onSelectProduct("ghe-suntem-302")} />

        {/* Xe dụng cụ — bên phải ghế (phía bác sĩ, hướng tường phải) */}
        <InstrumentCart position={[-2.8, 0, -8.5]} rotation={[0, 0, 0]} />

        {/* Bàn bác sĩ — góc trước-trái (gần cửa ra vào) */}
        <DoctorDesk position={[-7.5, 0, -5.5]} rotation={[0, Math.PI * 0.15, 0]} />

        {/* Quầy công tác dài — sát TOÀN BỘ tường trái */}
        <WallCounter position={[-9.6, 0, -9.5]} rotation={[0, Math.PI / 2, 0]} length={6.0} />

        {/* Tủ thuốc treo tường — trên quầy trái */}
        <SmallCabinet position={[-9.55, 1.82, -7.5]}  rotation={[0, Math.PI / 2, 0]} />
        <SmallCabinet position={[-9.55, 1.82, -11.0]} rotation={[0, Math.PI / 2, 0]} />

        {/* Tủ lưu trữ phim / vật tư — tường trái (dưới sàn) */}
        <ProStorageCabinet position={[-9.5, 0,  -6.2]} rotation={[0, Math.PI / 2, 0]}
          onClick={() => onSelectProduct("sensor-rvg-woodpecker")} />

        {/* ── LeadScreen — vách ngăn bức xạ, chia trái/phải ── */}
        <LeadScreen position={[-0.4, 0, -8.5]} rotation={[0, 0, 0]} />

        {/* ► MÁY X-QUANG PLANMECA — sát tường phải, quay vào trong */}
        <GLBModel modelPath={M.planmeca} targetHeight={2.4}
          position={[7.5, 0, -8.5]} rotation={[0, -Math.PI / 2, 0]}
          glowColor="#90CAF9"
          onClick={() => onSelectProduct("xray-panoramic-op300")} />

        {/* Rèm quanh khu X-quang (phía trước máy, cách ly bệnh nhân) */}
        <PrivacyCurtain position={[4.2, 0, -7.0]} rotation={[0, Math.PI / 2, 0]} width={3.2} height={2.55} />

        {/* Quầy công tác — sát tường sau (góc phải sau phòng) */}
        <WallCounter position={[5.5, 0, -12.5]} rotation={[0, Math.PI, 0]} length={5.0} />

        {/* Tủ treo tường sau */}
        <SmallCabinet position={[3.5, 1.82, -12.45]} rotation={[0, Math.PI, 0]} />
        <SmallCabinet position={[7.2, 1.82, -12.45]} rotation={[0, Math.PI, 0]} />

        {/* Bàn điều khiển (console) — sau màn chì, góc sau-trái */}
        <ControlConsole position={[-5.5, 0, -11.8]} rotation={[0, Math.PI * 0.12, 0]} />

        {/* Tủ lưu trữ sát tường sau-trái */}
        <ProStorageCabinet position={[-9.5, 0, -11.5]} rotation={[0, Math.PI / 2, 0]}
          onClick={() => onSelectProduct("sensor-rvg")} />




        {/* ══════════════════════════════════════════
            KHU CHỜ + TIẾP ĐÓN  (z: 4→11)
            Layout: hàng ghế sát tường trái — bàn lễ tân bên phải
        ══════════════════════════════════════════ */}

        {/* Quầy lễ tân — tường phải, mặt nhìn vào phòng */}
        <ProReceptionDesk position={[7.0, 0, 7.0]} rotation={[0, Math.PI, 0]} />

        {/* Hàng ghế A — sát tường trái (đủ cách tường 0.5m) */}
        {[5.2, 6.8, 8.4].map((z, i) => (
          <ProWaitingChair key={`wa${i}`} position={[-9.0, 0, z]} rotation={[0, Math.PI / 2, 0]} />
        ))}

        {/* Hàng ghế B — đối diện hàng A (tạo không gian chờ đôi) */}
        {[5.2, 6.8, 8.4].map((z, i) => (
          <ProWaitingChair key={`wb${i}`} position={[-6.2, 0, z]} rotation={[0, -Math.PI / 2, 0]} />
        ))}

        {/* Bàn tạp chí giữa 2 hàng ghế */}
        <CoffeeTable position={[-7.6, 0, 6.8]} />

        {/* Cây trang trí — 3 góc phòng chờ */}
        <PlantDecor position={[-9.2, 0, 10.5]} scale={1.1} />
        <PlantDecor position={[ 9.0, 0, 10.5]} scale={1.0} />
        <PlantDecor position={[-9.2, 0,  4.5]} scale={0.82} />

        {/* Contact shadows */}
        <ContactShadows position={[0,-0.49,0]} opacity={0.2} scale={48} blur={3} far={8} color="#050812" />
      </Suspense>

      <OrbitControls makeDefault enablePan enableZoom enableRotate
        panSpeed={0.5} rotateSpeed={0.45} zoomSpeed={0.7}
        dampingFactor={0.055} enableDamping
        minDistance={5} maxDistance={42}
        maxPolarAngle={Math.PI / 2.06} minPolarAngle={0.18}
        autoRotate autoRotateSpeed={0.2}
        target={[0, 1.2, -1]} />
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════ */
const EASE = [0.22, 1, 0.36, 1];

export default function ClinicShowroomPro() {
  const [loaded, setLoaded]     = useState(false);
  const [selected, setSelected] = useState(null);

  const handleSelect = (id) => {
    const p = products.find(i => i.id === id);
    if (p) setSelected(p);
  };

  return (
    <section id="showroom-3d-pro" className="relative bg-[#0C1520] py-20 overflow-hidden">
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(74,138,181,0.10) 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0C1520] to-transparent" />

      {/* Header */}
      <div className="relative mx-auto max-w-6xl px-6 text-center mb-10">
        <motion.div className="inline-flex items-center gap-2.5 mb-6"
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.55, ease: EASE }}>
          <span className="w-px h-4 bg-primary/50" />
          <span className="text-[10px] font-bold tracking-[0.32em] text-primary uppercase">Showroom Ảo — Mặt Bằng 3D</span>
          <span className="w-px h-4 bg-primary/50" />
        </motion.div>
        <motion.h2
          className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-white leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.08, ease: EASE }}>
          Phòng Khám Nha Khoa <span className="text-primary">3D</span>
        </motion.h2>

      </div>

      {/* Canvas */}
      <motion.div className="relative mx-auto max-w-7xl px-4 md:px-6"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.72, delay: 0.22, ease: EASE }}>
        <div className="relative w-full rounded-2xl overflow-hidden"
          style={{ height: "78vh", minHeight: 540, maxHeight: 900,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 32px 64px rgba(0,0,0,0.6)" }}>

          <AnimatePresence>
            {!loaded && (
              <motion.div key="loader" className="absolute inset-0 z-20"
                exit={{ opacity: 0, transition: { duration: 0.5 } }}>
                <Loader />
              </motion.div>
            )}
          </AnimatePresence>

          <Canvas shadows camera={{ position: [16, 12, 20], fov: 50 }}
            gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
            dpr={[1, 1.5]} onCreated={() => setTimeout(() => setLoaded(true), 900)}>
            <ShowroomScene onSelectProduct={handleSelect} />
          </Canvas>

          {/* Controls hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3.5 px-4 py-2 rounded-full bg-black/55 backdrop-blur-md text-white/40 text-[10px] font-semibold pointer-events-none select-none whitespace-nowrap border border-white/[0.07]">
            {[
              { d: "M12 2a10 10 0 0 1 0 20",  label: "Kéo xoay"   },
              { d: "M21 21l-6-6M3 11a8 8 0 1 0 16 0", label: "Cuộn thu/phóng" },
              { d: "M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5", label: "Nhấp xem sản phẩm" },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="w-px h-2.5 bg-white/15" />}
                <span className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
                    <path d={item.d} />
                  </svg>
                  {item.label}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Corner badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-white/[0.08] rounded-xl px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-white/50 text-[9px] font-bold uppercase tracking-[0.24em]">HD Dental · Showroom 3D</span>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-primary/15 border border-primary/25 rounded-xl px-3 py-1.5">
            <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
            </svg>
            <span className="text-primary/80 text-[9px] font-bold uppercase tracking-[0.2em]">Nhấp thiết bị để xem</span>
          </div>

          {/* Zone legend */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/[0.07]">
            {[
              { color: "#4DB6AC", label: "Phòng điều trị" },
              { color: "#90CAF9", label: "Chẩn đoán hình ảnh" },
              { color: "#CE93D8", label: "Khu chờ & tiếp đón" },
            ].map(({ color, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-[9px] font-bold text-white/45 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Feature pills */}
      <motion.div className="relative mx-auto max-w-4xl px-6 mt-8 flex flex-wrap justify-center gap-2.5"
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.3, ease: EASE }}>
        {["2 Phòng Điều Trị", "Ghế Nha Khoa Cao Cấp", "VATECH CBCT", "Planmeca X-Quang", "Khu Chờ Khám", "Quầy Lễ Tân"].map(label => (
          <span key={label}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/[0.1] text-white/40 text-[10px] font-semibold tracking-wide hover:border-primary/35 hover:text-primary/70 transition-colors cursor-default">
            <span className="w-1 h-1 rounded-full bg-primary/50" />
            {label}
          </span>
        ))}
      </motion.div>

      {selected && <ProProductModal product={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
