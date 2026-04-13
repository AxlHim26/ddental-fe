import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useRouter } from "next/navigation";
import Room from "./Room";
import DentalChair from "./DentalChair";
import DentalLight from "./DentalLight";
import XRayMachine from "./XRayMachine";
import Cabinet from "./Cabinet";
import Monitor from "./Monitor";
import InstrumentTray from "./InstrumentTray";
import Reception from "./Reception";
import DentistStool from "./DentistStool";
import MedicalCart from "./MedicalCart";
import WaitingLounge from "./WaitingLounge";
import SurgicalLaser from "./SurgicalLaser";
import Microscope from "./Microscope";
import DentalPrinter from "./DentalPrinter";
import Defibrillator from "./Defibrillator";
import { products as clinicEquipment } from "../../lib/productData";
import { useCart } from "../../context/CartContext";
import { useSiteAuth } from "../../context/SiteAuthContext";

const formatVND = (price) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

export default function ClinicScene() {
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [cartState, setCartState] = useState("idle"); // "idle" | "adding" | "added" | "error"
  const [errorMsg, setErrorMsg] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { addItem } = useCart();
  const { user, ready } = useSiteAuth();
  const router = useRouter();

  const handleEquipmentClick = (equipId) => {
    const equip = clinicEquipment.find((e) => e.id === equipId);
    if (equip) {
      setSelectedEquipment(equip);
      setCartState("idle");
      setErrorMsg("");
    }
  };

  const handleAddToCart = () => {
    if (!selectedEquipment || !ready || cartState === "adding") return;

    if (!user) {
      setShowLoginPrompt(true);
      return;
    }

    setCartState("adding");
    const result = addItem(selectedEquipment.id, 1);

    if (!result.ok) {
      const msg =
        result.error === "out_of_stock"
          ? "Sản phẩm hiện đang hết hàng."
          : result.error === "not_found"
          ? "Không tìm thấy sản phẩm."
          : "Đã có lỗi xảy ra.";
      setErrorMsg(msg);
      setCartState("error");
      return;
    }

    setCartState("added");
    setTimeout(() => setSelectedEquipment(null), 1400);
  };

  const goToLogin = () => {
    setShowLoginPrompt(false);
    setSelectedEquipment(null);
    router.push("/login");
  };

  return (
    <section className="relative bg-black py-20">
      {/* Subtle radial glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(220,38,38,0.07)_0%,transparent_60%)]" />

      {/* Header */}
      <div className="relative mx-auto max-w-7xl px-6 text-center mb-10">
        <span className="inline-block text-xs font-semibold tracking-widest text-primary uppercase mb-4">
          Trải nghiệm tương tác
        </span>
        <h2 className="font-heading font-black text-4xl md:text-5xl text-white leading-tight mb-4">
          Phòng Khám 3D <span className="text-primary">Ảo</span>
        </h2>
        <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto">
          Khám phá phòng khám nha khoa hiện đại theo không gian 3D. Nhấp vào từng thiết bị
          để xem chi tiết và thêm vào giỏ hàng.
        </p>
      </div>

      {/* Canvas wrapper */}
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="relative w-full rounded-2xl overflow-hidden border border-white/8"
             style={{ height: "70vh", minHeight: 500, maxHeight: 800, background: "#060d1a" }}>

          <Canvas
            shadows
            camera={{ position: [6, 4, 8], fov: 50 }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 1.5]}
          >
            <color attach="background" args={["#060d1a"]} />
            <fog attach="fog" args={["#060d1a", 15, 35]} />

            <ambientLight intensity={0.3} color="#e0f2fe" />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1}
              color="#f0f9ff"
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-camera-far={30}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <directionalLight position={[-3, 5, -5]} intensity={0.4} color="#0ea5e9" />
            <pointLight position={[0, 3, 8]} intensity={0.5} color="#fef3c7" />

            <Suspense fallback={null}>
              <Environment preset="city" />
              <Room />

              {/* Station 1 */}
              <group position={[-6, 0, 10]}>
                <DentalChair onClick={() => handleEquipmentClick("ghe-grace-x2")} />
                <group position={[0.5, 0, 0.5]}>
                  <DentalLight onClick={() => handleEquipmentClick("den-valo-grand")} />
                </group>
                <group position={[2, 0, -1.5]} rotation={[0, -0.4, 0]}>
                  <Monitor onClick={() => handleEquipmentClick("xray-pax-i3d")} />
                </group>
                <group position={[1.8, 0, 0.8]}>
                  <InstrumentTray onClick={() => handleEquipmentClick("den-maxcure9")} />
                </group>
                <group position={[-1, 0, -1.5]}>
                  <DentistStool onClick={() => handleEquipmentClick("ghe-suntem-302")} />
                </group>
                <group position={[2, 0, -3.5]} rotation={[0, Math.PI / 2, 0]}>
                  <MedicalCart onClick={() => handleEquipmentClick("den-beyond-ii")} />
                </group>
                <group position={[-1.5, 0, -3.5]} rotation={[0, Math.PI / 4, 0]}>
                  <Microscope onClick={() => handleEquipmentClick("xray-panoramic-op300")} />
                </group>
              </group>

              {/* Station 2 */}
              <group position={[-6, 0, 0]}>
                <DentalChair onClick={() => handleEquipmentClick("ghe-anthos-a3")} />
                <group position={[0.5, 0, 0.5]}>
                  <DentalLight onClick={() => handleEquipmentClick("den-ledex")} />
                </group>
                <group position={[2, 0, -1.5]} rotation={[0, -0.4, 0]}>
                  <Monitor onClick={() => handleEquipmentClick("sensor-rvg")} />
                </group>
                <group position={[1.8, 0, 0.8]}>
                  <InstrumentTray onClick={() => handleEquipmentClick("den-maxcure3")} />
                </group>
                <group position={[-1, 0, -1.5]}>
                  <DentistStool onClick={() => handleEquipmentClick("ghe-suntem-d307")} />
                </group>
                <group position={[2, 0, -3.5]} rotation={[0, Math.PI / 2, 0]}>
                  <MedicalCart onClick={() => handleEquipmentClick("ghe-cingol-x3")} />
                </group>
              </group>

              {/* Station 3 */}
              <group position={[-6, 0, -10]}>
                <DentalChair onClick={() => handleEquipmentClick("ghe-fengdan-ql2028")} />
                <group position={[0.5, 0, 0.5]}>
                  <DentalLight onClick={() => handleEquipmentClick("den-valo-grand")} />
                </group>
                <group position={[-1, 0, -1.5]}>
                  <DentistStool onClick={() => handleEquipmentClick("ghe-suntem-302")} />
                </group>
                <group position={[2, 0, -2]} rotation={[0, Math.PI / 4, 0]}>
                  <SurgicalLaser onClick={() => handleEquipmentClick("xray-cbct-cs9300")} />
                </group>
              </group>

              {/* Back wall */}
              <group position={[0, 0, -13]}>
                <XRayMachine onClick={() => handleEquipmentClick("xray-pax-i3d")} />
              </group>
              <group position={[-6, 0, -13]}>
                <Cabinet onClick={() => handleEquipmentClick("sensor-rvg-woodpecker")} />
              </group>
              <group position={[6, 0, -13]}>
                <Cabinet onClick={() => handleEquipmentClick("xray-panoramic-op300")} />
              </group>
              <group position={[8, 0, -14]} rotation={[0, -Math.PI / 4, 0]}>
                <DentalPrinter onClick={() => handleEquipmentClick("xray-cbct-cs9300")} />
              </group>

              {/* Reception + Waiting */}
              <group position={[7, 0, -2]} rotation={[0, -Math.PI / 2, 0]}>
                <Reception />
              </group>
              <group position={[7, 0, 11]} rotation={[0, -Math.PI / 2, 0]}>
                <WaitingLounge onClick={() => handleEquipmentClick("ghe-anthos-a3")} />
              </group>
              <group position={[8, 0, 4]} rotation={[0, -Math.PI / 2, 0]}>
                <Defibrillator onClick={() => handleEquipmentClick("den-beyond-ii")} />
              </group>

              <ContactShadows
                position={[0, -0.49, 0]}
                opacity={0.4}
                scale={40}
                blur={2}
                far={6}
                color="#0a1628"
              />
            </Suspense>

            <OrbitControls
              makeDefault
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={3}
              maxDistance={18}
              maxPolarAngle={Math.PI / 2.1}
              minPolarAngle={0.2}
              autoRotate
              autoRotateSpeed={0.3}
              target={[0, 1, 0]}
            />
          </Canvas>

          {/* Controls hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4 px-5 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-white/50 text-xs pointer-events-none select-none">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth={1.5}/><path d="M12 2v10M12 12l6 6" strokeWidth={1.5}/></svg>
              Kéo để xoay
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6M3 11a8 8 0 1 0 16 0 8 8 0 0 0-16 0" strokeWidth={1.5} strokeLinecap="round"/></svg>
              Cuộn để thu/phóng
            </span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/></svg>
              Nhấp để chọn thiết bị
            </span>
          </div>
        </div>
      </div>

      {/* Equipment popup */}
      {selectedEquipment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedEquipment(null)}
        >
          <div
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Product image */}
            {selectedEquipment.image && (
              <div className="relative h-52 bg-zinc-800 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-900/80" />
                <img
                  src={selectedEquipment.image}
                  alt={selectedEquipment.name}
                  className="h-full w-full object-contain p-6"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                {selectedEquipment.tag && (
                  <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-white">
                    {selectedEquipment.tag}
                  </span>
                )}
                {/* Close */}
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 border border-white/10 text-white/70 hover:text-white hover:bg-black/80 flex items-center justify-center transition-colors"
                  onClick={() => setSelectedEquipment(null)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              {/* Brand + name */}
              <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-1">
                {selectedEquipment.brand}
              </p>
              <h3 className="font-heading font-bold text-xl text-white leading-snug mb-2">
                {selectedEquipment.name}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed line-clamp-2 mb-4">
                {selectedEquipment.description}
              </p>

              {/* Rating */}
              {selectedEquipment.rating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1,2,3,4,5].map((s) => (
                      <svg key={s} className={`w-4 h-4 ${s <= Math.round(selectedEquipment.rating) ? "text-yellow-400" : "text-white/20"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white/40 text-xs">{selectedEquipment.rating} ({selectedEquipment.reviews} đánh giá)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-end gap-3 mb-5">
                <span className="text-2xl font-black text-primary font-heading">
                  {formatVND(selectedEquipment.price)}
                </span>
                {selectedEquipment.oldPrice && (
                  <span className="text-white/30 text-sm line-through pb-0.5">
                    {formatVND(selectedEquipment.oldPrice)}
                  </span>
                )}
              </div>

              {/* Error message */}
              {cartState === "error" && errorMsg && (
                <p className="text-red-400 text-xs mb-3">{errorMsg}</p>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                    cartState === "added"
                      ? "bg-green-500 text-white"
                      : cartState === "error"
                      ? "bg-red-500/80 text-white"
                      : selectedEquipment.inStock === false
                      ? "bg-zinc-700 text-white/50"
                      : "bg-primary hover:bg-primary/90 text-white"
                  }`}
                  onClick={handleAddToCart}
                  disabled={
                    cartState === "adding" ||
                    cartState === "added" ||
                    selectedEquipment.inStock === false
                  }
                >
                  {cartState === "added" ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Đã thêm!
                    </>
                  ) : cartState === "adding" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Đang thêm...
                    </>
                  ) : selectedEquipment.inStock === false ? (
                    "Hết hàng"
                  ) : !user ? (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Đăng nhập để thêm
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Thêm vào giỏ
                    </>
                  )}
                </button>
                <a
                  href={`/shop/${selectedEquipment.category}`}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-white/70 hover:border-white/30 hover:text-white text-sm font-semibold transition-all flex items-center whitespace-nowrap"
                >
                  Chi tiết
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login prompt modal */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 w-9 h-9 rounded-full text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              onClick={() => setShowLoginPrompt(false)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-4 w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>

            <h3 className="font-heading font-bold text-xl text-white mb-2">
              Cần đăng nhập để thêm vào giỏ hàng
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Đăng nhập để lưu sản phẩm vào giỏ hàng, theo dõi số lượng và tiếp tục đặt hàng thuận tiện hơn.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="px-5 py-3 rounded-2xl border border-white/15 text-white/70 hover:border-white/30 hover:text-white text-sm font-semibold transition-colors"
                onClick={() => setShowLoginPrompt(false)}
              >
                Để sau
              </button>
              <button
                className="px-5 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                onClick={goToLogin}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Đăng nhập ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
