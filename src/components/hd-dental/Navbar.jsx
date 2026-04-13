import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, LogIn, LogOut } from "lucide-react";
import { useSiteAuth } from "@/context/SiteAuthContext";

const navLinks = [
  { label: "Trang chủ", href: "#hero" },
  { label: "Về chúng tôi", to: "/ve-chung-toi" },
  { label: "Sản phẩm", to: "/shop" },
  { label: "Dịch vụ", to: "/dich-vu" },
  { label: "Tin tức", to: "/news" },
];

export default function Navbar() {
  const { user, ready, skipped, logout } = useSiteAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const onHome = location.pathname === "/";
  const showAuthAction = ready && !skipped;
  const isActivePath = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const desktopLinkClasses = (isActive) =>
    `relative font-body text-sm font-medium tracking-wide transition-colors ${
      isActive
        ? "text-primary"
        : scrolled || !onHome
          ? "text-foreground hover:text-primary"
          : "text-white/90 hover:text-white"
    }`;

  const desktopIndicatorClasses = (isActive) =>
    `absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary transition-all duration-300 ${
      isActive ? "w-full opacity-100" : "w-0 opacity-0"
    }`;

  const mobileLinkClasses = (isActive) =>
    `rounded-lg px-3 py-2 font-body text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-foreground hover:text-primary hover:bg-muted/70"
    }`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const goToSection = (href) => {
    setMobileOpen(false);
    if (!onHome) {
      navigate({ pathname: "/", hash: href.replace(/^#/, "") });
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const goToLogin = () => {
    setMobileOpen(false);
    navigate("/login", {
      state: { from: onHome ? "/shop" : location.pathname },
    });
  };

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !onHome
          ? "bg-background/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          onClick={() => {
            setMobileOpen(false);
          }}
          className="flex items-center gap-2"
        >
          <img
            src="/images/logo.png"
            alt="Logo HD Dental"
            className="h-14 sm:h-16 md:h-20 lg:h-[4.5rem] xl:h-24 w-auto object-contain origin-left scale-110 sm:scale-125 md:scale-[1.35] lg:scale-125 xl:scale-150 transition-transform"
          />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) =>
            link.to ? (
              <Link
                key={link.label}
                to={link.to}
                className={desktopLinkClasses(isActivePath(link.to))}
              >
                {link.label}
                <span
                  className={desktopIndicatorClasses(isActivePath(link.to))}
                />
              </Link>
            ) : (
              <button
                key={link.href}
                type="button"
                onClick={() => goToSection(link.href)}
                className={desktopLinkClasses(onHome)}
              >
                {link.label}
                <span className={desktopIndicatorClasses(onHome)} />
              </button>
            ),
          )}

          {showAuthAction && (
            <button
              type="button"
              onClick={user ? handleLogout : goToLogin}
              className={`font-body text-sm font-medium flex items-center gap-1.5 hover:text-primary transition-colors ${
                scrolled || !onHome ? "text-foreground" : "text-white/90"
              }`}
            >
              {user ? (
                <LogOut className="w-4 h-4" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {user ? "Đăng xuất" : "Đăng nhập"}
            </button>
          )}
          <Link
            to="/lien-he"
            onClick={() => setMobileOpen(false)}
            className={`bg-primary text-primary-foreground font-body text-sm font-semibold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary/90 transition-colors ${
              isActivePath("/lien-he") ? "ring-2 ring-offset-2 ring-offset-background ring-white/90" : ""
            }`}
          >
            <Phone className="w-4 h-4" />
            Liên hệ
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden ${scrolled || !onHome ? "text-foreground" : "text-white"}`}
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background/98 backdrop-blur-md border-t border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) =>
                link.to ? (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={mobileLinkClasses(isActivePath(link.to))}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => goToSection(link.href)}
                    className={`${mobileLinkClasses(onHome)} text-left`}
                  >
                    {link.label}
                  </button>
                ),
              )}

              {showAuthAction && (
                <button
                  type="button"
                  onClick={user ? handleLogout : goToLogin}
                  className="font-body text-sm font-medium text-foreground py-2 text-left hover:text-primary flex items-center gap-2"
                >
                  {user ? (
                    <LogOut className="w-4 h-4" />
                  ) : (
                    <LogIn className="w-4 h-4" />
                  )}
                  {user ? "Đăng xuất" : "Đăng nhập"}
                </button>
              )}
              <Link
                to="/lien-he"
                onClick={() => setMobileOpen(false)}
                className="bg-primary text-primary-foreground font-body text-sm font-semibold px-5 py-3 rounded-full flex items-center justify-center gap-2 mt-2"
              >
                <Phone className="w-4 h-4" />
                Liên hệ ngay
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
