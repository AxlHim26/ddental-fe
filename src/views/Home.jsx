"use client";

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/hd-dental/Navbar";
import HeroSection from "../components/hd-dental/HeroSection";
import StatsBar from "../components/hd-dental/StatsBar";
import TimelineSection from "../components/hd-dental/TimelineSection";
import ProductFlipBook from "../components/hd-dental/ProductFlipBook";
import ReviewSection from "../components/hd-dental/ReviewSection";
import CTABanner from "../components/hd-dental/CTABanner";
import FAQSection from "../components/hd-dental/FAQSection";
import PartnersCarousel from "../components/hd-dental/PartnersCarousel";
import Footer from "../components/hd-dental/Footer";

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return undefined;
    const id = location.hash.replace(/^#/, "");
    if (!id) return undefined;
    const t = window.setTimeout(() => {
      const el = document.getElementById(id) || document.querySelector(`#${CSS.escape(id)}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background font-body">
      <Navbar />
      <HeroSection />
      <StatsBar />
      <TimelineSection />
      <ProductFlipBook />
      <ReviewSection />
      <CTABanner />
      <FAQSection />
      <PartnersCarousel />
      <Footer />
    </div>
  );
}
