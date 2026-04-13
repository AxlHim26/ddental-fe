"use client";

import { useEffect, useMemo, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, Calendar, Heart, MessageCircle } from "lucide-react";
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
  const articleKey = useMemo(
    () => (slug ? `news-article-liked:${slug}` : null),
    [slug]
  );
  const commentsKey = useMemo(
    () => (slug ? `news-article-comments:${slug}` : null),
    [slug]
  );
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (!articleKey) return;
    const saved = window.localStorage.getItem(articleKey);
    setLiked(saved === "1");
  }, [articleKey]);

  useEffect(() => {
    if (!commentsKey) return;
    const saved = window.localStorage.getItem(commentsKey);
    if (!saved) {
      setComments([]);
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        setComments(parsed);
      } else {
        setComments([]);
      }
    } catch {
      setComments([]);
    }
  }, [commentsKey]);

  const handleLike = () => {
    if (!articleKey) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    window.localStorage.setItem(articleKey, nextLiked ? "1" : "0");
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!commentsKey) return;

    const text = commentText.trim();
    if (!text) return;

    const nextComments = [
      ...comments,
      {
        id: Date.now(),
        text,
        createdAt: new Date().toISOString(),
      },
    ];
    setComments(nextComments);
    setCommentText("");
    window.localStorage.setItem(commentsKey, JSON.stringify(nextComments));
  };

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
            <div className="mt-12 pt-8 border-t border-border flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={handleLike}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                  liked
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/30"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                {liked ? 101 : 100}
              </button>

              <button
                type="button"
                onClick={() => setShowComments((prev) => !prev)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                  showComments
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-primary hover:border-primary/30"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                {100 + comments.length}
              </button>

              <Link
                to="/news"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline sm:ml-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Quay lại danh sách tin
              </Link>
            </div>

            {showComments && (
              <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 sm:p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  Bình luận
                </h3>

                <form onSubmit={handleSubmitComment} className="mt-3 flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
                  />
                  <button
                    type="submit"
                    className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                  >
                    Gửi
                  </button>
                </form>

                <div className="mt-4 space-y-3">
                  {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Chưa có bình luận nào.
                    </p>
                  ) : (
                    comments
                      .slice()
                      .reverse()
                      .map((item) => (
                        <div
                          key={item.id}
                          className="rounded-lg border border-border bg-background px-3 py-2"
                        >
                          <p className="text-sm text-foreground/90">{item.text}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
