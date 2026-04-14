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
              {slug === "mo-rong-thi-truong-dong-nam-a" ? (
                <>
                  <p>
                    Năm 2026 đánh dấu bước tiến quan trọng trong chiến lược
                    phát triển quốc tế của HD Dental khi công ty chính thức xúc
                    tiến hợp tác phân phối tại các thị trường Đông Nam Á, bắt
                    đầu với Campuchia, Lào và mở rộng dần sang các nước ASEAN
                    khác. Đây không chỉ là câu chuyện mở rộng địa lý, mà là
                    chiến lược tổng thể nhằm{" "}
                    <strong>
                      chuẩn hóa chất lượng thiết bị và dịch vụ hậu mãi nha
                      khoa
                    </strong>{" "}
                    trong toàn khu vực — nơi ngành nha khoa đang tăng trưởng
                    mạnh mẽ nhờ tầng lớp trung lưu ngày càng chú trọng sức
                    khỏe răng miệng.
                  </p>

                  <h2
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginTop: "1.75rem",
                      marginBottom: "0.5rem",
                      paddingLeft: "0.875rem",
                      borderLeft: "4px solid hsl(var(--primary))",
                    }}
                  >
                    Chuỗi Cung Ứng Được Tối Ưu — Lợi Ích Trực Tiếp Cho Phòng
                    Khám
                  </h2>
                  <p>
                    Một trong những rào cản lớn nhất khi nhập khẩu thiết bị nha
                    khoa vào các nước Đông Nam Á là thời gian thông quan kéo
                    dài và chi phí logistics phân mảnh. Với mạng lưới đối tác
                    địa phương được thiết lập tại từng thị trường, HD Dental có
                    thể rút ngắn thời gian giao hàng, giảm thiểu rủi ro hư hỏng
                    trong vận chuyển và đảm bảo linh kiện thay thế luôn sẵn có.
                    Điều này mang lại lợi ích thiết thực: phòng khám không phải
                    chờ đợi hàng tuần khi thiết bị cần sửa chữa, và chi phí
                    nhập khẩu được phân bổ hiệu quả hơn nhờ quy mô đơn hàng
                    hợp nhất toàn vùng.
                  </p>
                  <p>
                    Ngoài ra, HD Dental triển khai trung tâm tổng hợp hàng hóa
                    (consolidation hub) tại một đầu mối khu vực, từ đó phân
                    phối đến các đại lý quốc gia. Mô hình này giúp tiết kiệm
                    20–35% chi phí vận chuyển so với nhập khẩu đơn lẻ từng lô
                    hàng nhỏ.
                  </p>

                  <img
                    src="https://images.unsplash.com/photo-1555421689-491a97ff2040?w=860&auto=format&fit=crop&q=75"
                    alt="Bản đồ chiến lược mở rộng thị trường Đông Nam Á của HD Dental"
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      margin: "1.25rem 0",
                      objectFit: "cover",
                      maxHeight: "380px",
                      display: "block",
                    }}
                  />

                  <h2
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginTop: "1.75rem",
                      marginBottom: "0.5rem",
                      paddingLeft: "0.875rem",
                      borderLeft: "4px solid hsl(var(--primary))",
                    }}
                  >
                    Hỗ Trợ Kỹ Thuật Đa Ngôn Ngữ — Tiêu Chuẩn Dịch Vụ Đồng Bộ
                  </h2>
                  <p>
                    Thách thức không kém phần quan trọng là dịch vụ hậu mãi sau
                    bán hàng. Mỗi thị trường có ngôn ngữ, quy định y tế và thói
                    quen vận hành thiết bị khác nhau. HD Dental giải quyết điều
                    này bằng đội ngũ hỗ trợ kỹ thuật đa ngôn ngữ — gồm tiếng
                    Việt, Khmer, Lào và tiếng Anh — sẵn sàng tư vấn từ xa qua
                    phone và video call. Bộ tài liệu hướng dẫn vận hành cũng
                    được dịch thuật và kiểm tra chuyên môn bởi bác sĩ nha khoa
                    bản địa để đảm bảo độ chính xác.
                  </p>
                  <p>
                    Khách hàng doanh nghiệp thuộc kênh ASEAN còn được hưởng{" "}
                    <strong>
                      gói logistics ưu tiên và hỗ trợ kỹ thuật tận nơi
                    </strong>{" "}
                    trong vòng 72 giờ sau khi báo sự cố — cam kết phản hồi nhanh
                    hơn nhiều so với tiêu chuẩn ngành. Với nền tảng này, HD
                    Dental hướng tới vị trí đối tác chiến lược đáng tin cậy cho
                    các phòng khám nha khoa hiện đại trên toàn khu vực, không
                    chỉ là nhà cung cấp thiết bị đơn thuần.
                  </p>
                </>
              ) : slug === "hoi-thao-nha-khoa-so-tphcm" ? (
                <>
                  <p>
                    Ngành nha khoa Việt Nam đang bước vào giai đoạn chuyển đổi
                    số mạnh mẽ — từ phim X-quang truyền thống sang cảm biến kỹ
                    thuật số, từ labo thủ công sang hệ thống CAD/CAM tự động. Để
                    đón đầu xu hướng này, HD Dental phối hợp cùng các đối tác
                    thiết bị và chuyên gia lâm sàng hàng đầu tổ chức{" "}
                    <strong>Hội Thảo Nha Khoa Số TP.HCM</strong> — sự kiện
                    chuyên môn quy mô lớn nhất trong năm dành cho các bác sĩ
                    và kỹ thuật viên nha khoa tại miền Nam.
                  </p>

                  <h2
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginTop: "1.75rem",
                      marginBottom: "0.5rem",
                      paddingLeft: "0.875rem",
                      borderLeft: "4px solid hsl(var(--primary))",
                    }}
                  >
                    Nội Dung Chương Trình: Ba Phiên Chuyên Sâu
                  </h2>
                  <p>
                    Hội thảo được thiết kế theo mô hình kết hợp lý thuyết và
                    thực hành, gồm ba phiên chính trong một ngày.{" "}
                    <strong>Phiên 1 — Workflow số hóa toàn phần:</strong> Diễn
                    giả trình bày lộ trình ứng dụng công nghệ kỹ thuật số từ
                    khâu tiếp nhận bệnh nhân, chụp X-quang kỹ thuật số
                    (RVG/CBCT), scan nội khẩu (intraoral scanner), đến thiết kế
                    phục hình trên phần mềm CAD và sản xuất bằng máy phay CAM.{" "}
                    <strong>Phiên 2 — Demo thiết bị trực tiếp:</strong> Kỹ thuật
                    viên HD Dental vận hành thực tế ghế điều trị thế hệ mới,
                    đèn trám LED đa chế độ và máy X-quang panoramic, giúp đại
                    biểu hiểu rõ tính năng trước khi quyết định đầu tư.{" "}
                    <strong>
                      Phiên 3 — Tư vấn tài chính cho phòng khám vừa:
                    </strong>{" "}
                    Chuyên gia phân tích ROI theo từng nhóm thiết bị và gợi ý
                    lộ trình nâng cấp phù hợp ngân sách, đồng thời giới thiệu
                    các gói hợp tác lắp đặt từ HD Dental.
                  </p>

                  <img
                    src="https://images.unsplash.com/photo-1588776814546-1ffebb5b0716?w=860&auto=format&fit=crop&q=75"
                    alt="Chuyên gia trình bày về công nghệ nha khoa số CAD/CAM tại hội thảo TP.HCM"
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      margin: "1.25rem 0",
                      objectFit: "cover",
                      maxHeight: "380px",
                      display: "block",
                    }}
                  />

                  <h2
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginTop: "1.75rem",
                      marginBottom: "0.5rem",
                      paddingLeft: "0.875rem",
                      borderLeft: "4px solid hsl(var(--primary))",
                    }}
                  >
                    Đối Tượng Tham Dự & Quyền Lợi Đại Biểu
                  </h2>
                  <p>
                    Sự kiện phù hợp với bác sĩ nha khoa đang vận hành phòng
                    khám tư nhân, quản lý chuỗi nha khoa, kỹ thuật viên labo và
                    sinh viên nha khoa năm cuối muốn cập nhật xu hướng công
                    nghệ. Mỗi đại biểu nhận tài liệu song ngữ Việt – Anh,
                    chứng nhận tham dự có giá trị CPD (Continuing Professional
                    Development), và quyền ưu đãi đặt hàng thiết bị trong vòng
                    30 ngày sau hội thảo. Nhóm từ ba người trở lên được giảm
                    phí đăng ký và hỗ trợ đặt chỗ theo nhóm.
                  </p>
                  <p>
                    Hội thảo giới hạn số lượng đại biểu để đảm bảo chất lượng
                    trao đổi và trải nghiệm demo thực chiến. Đăng ký sớm để giữ
                    chỗ qua website hoặc fanpage HD Dental — đội ngũ sẽ xác nhận
                    và gửi tài liệu chuẩn bị trước sự kiện.
                  </p>
                </>
              ) : slug === "bao-tri-thiet-bi-dinh-ky" ? (

                <>
                  <p>
                    Thiết bị nha khoa hoạt động liên tục mỗi ngày, chịu tải cao
                    và tiếp xúc nhiều tác nhân ăn mòn. Một chiếc ghế điều trị
                    hỏng đột ngột hay máy X-quang xuống cấp không chỉ gián đoạn
                    lịch hẹn mà còn ảnh hưởng trực tiếp đến chất lượng điều
                    trị. Đó là lý do HD Dental triển khai{" "}
                    <strong>gói bảo trì thiết bị nha khoa định kỳ</strong> —
                    giải pháp giúp phòng khám vận hành ổn định và an tâm phục
                    vụ bệnh nhân.
                  </p>

                  <h2
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginTop: "1.75rem",
                      marginBottom: "0.5rem",
                      paddingLeft: "0.875rem",
                      borderLeft: "4px solid hsl(var(--primary))",
                    }}
                  >
                    Tại Sao Bảo Trì Định Kỳ Là Điều Bắt Buộc?
                  </h2>
                  <p>
                    Theo khuyến nghị của các nhà sản xuất, ghế nha khoa, máy
                    nén khí, tay khoan và hệ thống hút nước cần được kiểm tra
                    ít nhất mỗi 6 tháng. Bỏ qua chu kỳ này khiến linh kiện
                    hao mòn nhanh hơn và chi phí sửa chữa tăng gấp nhiều lần.
                    Bên cạnh đó, đường ống dẫn nước nếu không vệ sinh định kỳ
                    có thể trở thành nguồn lây nhiễm chéo tiềm ẩn trong phòng
                    khám.
                  </p>

                  <img
                    src="https://images.unsplash.com/photo-1629909615184-74f495363b67?w=860&auto=format&fit=crop&q=75"
                    alt="Kỹ thuật viên thực hiện bảo trì thiết bị nha khoa định kỳ"
                    style={{
                      width: "100%",
                      borderRadius: "12px",
                      margin: "1.25rem 0",
                      objectFit: "cover",
                      maxHeight: "380px",
                      display: "block",
                    }}
                  />

                  <h2
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginTop: "1.75rem",
                      marginBottom: "0.5rem",
                      paddingLeft: "0.875rem",
                      borderLeft: "4px solid hsl(var(--primary))",
                    }}
                  >
                    Gói Bảo Trì HD Dental Bao Gồm Những Gì?
                  </h2>
                  <p>
                    HD Dental cung cấp gói{" "}
                    <strong>6 tháng và 12 tháng</strong>, bao gồm: kiểm tra
                    toàn bộ cơ cấu cơ-điện ghế điều trị, hiệu chuẩn áp suất
                    tay khoan, vệ sinh bộ lọc máy nén khí, kiểm tra sensor
                    X-quang và khử khuẩn hệ thống đường nước. Toàn bộ thực
                    hiện bởi kỹ thuật viên có chứng chỉ, sử dụng linh kiện
                    chính hãng.
                  </p>

                  <h2
                    style={{
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      marginTop: "1.75rem",
                      marginBottom: "0.5rem",
                      paddingLeft: "0.875rem",
                      borderLeft: "4px solid hsl(var(--primary))",
                    }}
                  >
                    Đăng Ký Ngay — Nhận Báo Giá Miễn Phí
                  </h2>
                  <p>
                    Quy trình đăng ký đơn giản: liên hệ hotline hoặc điền form
                    trên website, đội ngũ HD Dental sẽ khảo sát danh sách
                    thiết bị và lên lịch phù hợp với hoạt động của phòng khám.
                    Mỗi đợt <strong>bảo trì thiết bị nha khoa</strong> chỉ mất
                    2–4 giờ, hạn chế tối đa ảnh hưởng đến lịch hẹn. Khách
                    hàng ký hợp đồng dài hạn được ưu đãi phí dịch vụ và hỗ
                    trợ kỹ thuật từ xa không giới hạn.
                  </p>
                </>
              ) : typeof article.body === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: article.body }} />
              ) : (
                article.body.map((para, i) => (
                  <p key={i}>{para}</p>
                ))
              )}
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
