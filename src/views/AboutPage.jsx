"use client";

import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/hd-dental/Navbar";
import Footer from "@/components/hd-dental/Footer";
import AboutSection from "@/components/hd-dental/AboutSection";
import FoundersSection from "@/components/hd-dental/FoundersSection";
import ServicesSection from "@/components/hd-dental/ServicesSection";

export default function AboutPage() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return undefined;
    const id = location.hash.replace(/^#/, "");
    if (!id) return undefined;
    const t = window.setTimeout(() => {
      const el = document.getElementById(id) || document.querySelector(`#${CSS.escape(id)}`);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 120);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />
      <main className="pt-20 sm:pt-24">
        <AboutSection />
        <FoundersSection />
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
}
