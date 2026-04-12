"use client";

import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { getArticleBySlug } from "@/lib/newsData";
import Navbar from "@/components/hd-dental/Navbar";
import Footer from "@/components/hd-dental/Footer";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function NewsArticlePage() {
  const { slug } = useParams();
  const article = slug ? getArticleBySlug(slug) : null;

  if (!article) {
    return <Navigate to="/news" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body">
      <Navbar />

      <article>
        <div className="relative h-[38vh] min-h-[220px] max-h-[420px] overflow-hidden bg-muted">
          <img
            src={article.image}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-16 sm:-mt-20 relative z-10 pb-16">
          <div className="bg-background rounded-2xl border border-border shadow-lg p-6 sm:p-10">
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
              {article.tag}
            </span>
            <h1 className="font-heading font-bold text-2xl sm:text-4xl mt-4 leading-tight">
              {article.title}
            </h1>
            <p className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDate(article.date)}
            </p>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed border-l-4 border-primary pl-4">
              {article.excerpt}
            </p>
            <div className="mt-10 space-y-5 text-base leading-relaxed text-foreground/90">
              {article.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-12 pt-8 border-t border-border">
              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại danh sách tin
              </Link>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
