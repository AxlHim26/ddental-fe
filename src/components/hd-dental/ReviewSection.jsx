import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const reviews = [
  {
    id: "rv-1",
    name: "BS. Hoang Anh",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80",
    stars: 5,
    text: "Chất lượng hoàn thiện và độ ổn định của thiết bị rất ấn tượng. Phòng khám vận hành mượt hơn sau khi nâng cấp.",
  },
  {
    id: "rv-2",
    name: "BS. Minh Chau",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    stars: 5,
    text: "Dịch vụ hướng dẫn sử dụng và bảo trì rất chuyên nghiệp. Giao diện sản phẩm rõ ràng, dễ so sánh và chọn mua.",
  },
  {
    id: "rv-3",
    name: "BS. Tran Duc",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    stars: 5,
    text: "Thiết bị vận hành êm, hình ảnh chẩn đoán sắc nét. Trải nghiệm trên điện thoại tốt hơn rất nhiều sau khi tối ưu.",
  },
  {
    id: "rv-4",
    name: "BS. Nha Quynh",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    stars: 5,
    text: "Cảm giác như đang xem catalogue cao cấp. Trình bày đẹp, gọn và điều hướng sản phẩm nhanh trên mọi thiết bị.",
  },
];

const SWIPE_THRESHOLD = 80;

function renderStars(count) {
  return "★".repeat(count);
}

export default function ReviewSection() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const total = reviews.length;
  const visible = [
    reviews[index],
    reviews[(index + 1) % total],
    reviews[(index + 2) % total],
  ];

  const goNext = () => {
    setDirection(1);
    setIndex((prev) => (prev + 1) % total);
  };

  const goPrev = () => {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + total) % total);
  };

  const onDragEnd = (_event, info) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      goNext();
      return;
    }
    if (info.offset.x >= SWIPE_THRESHOLD) {
      goPrev();
    }
  };

  return (
    <section className="overflow-x-hidden bg-zinc-50 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-5 lg:px-8">
        <header className="mb-9 text-center sm:mb-10">
          <h2 className="text-balance font-heading text-2xl font-black text-zinc-900 sm:text-3xl lg:text-4xl">
            Khách hàng nói gì về sản phẩm
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty font-body text-sm leading-relaxed text-zinc-600 sm:text-base">
            Phản hồi thực tế từ các phòng khám đã sử dụng thiết bị tại HD Dental.
          </p>
        </header>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={onDragEnd}
            initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((item) => (
              <article
                key={`${index}-${item.id}`}
                className="w-full max-w-full rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_12px_36px_rgba(15,23,42,0.08)] sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-12 w-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-body text-sm font-semibold text-zinc-900">
                      {item.name}
                    </p>
                    <p className="text-sm tracking-[0.16em] text-amber-500">
                      {renderStars(item.stars)}
                    </p>
                  </div>
                </div>

                <p className="mt-4 text-pretty font-body text-sm leading-relaxed text-zinc-600">
                  {item.text}
                </p>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="inline-flex min-w-[120px] items-center justify-center rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-900 hover:text-zinc-900"
          >
            Trước
          </button>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            Sau
          </button>
        </div>
      </div>
    </section>
  );
}
