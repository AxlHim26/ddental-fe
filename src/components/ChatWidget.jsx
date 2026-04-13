"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// ============================================================
// CHATBOT FLOW DATA
// ============================================================

const FLOW = {
  main_menu: {
    botMessages: [
      "Chào bạn,\nHD Dental rất vui khi hỗ trợ bạn.\nBạn muốn tư vấn về gì ạ?",
    ],
    options: [
      { label: "Tư vấn khóa học", next: "course_menu" },
      { label: "Tư vấn sản phẩm", next: "product_menu" },
      { label: "Đăng ký tư vấn", next: "register_menu" },
    ],
  },

  // ── NHÁNH 1: KHÓA HỌC ────────────────────────────────────
  course_menu: {
    botMessages: [
      "HD Dental hiện có các chương trình đào tạo dành cho bác sĩ và kỹ thuật viên nha khoa.\n\nBạn quan tâm nội dung nào ạ?",
    ],
    options: [
      { label: "Khóa chỉnh nha", next: "course_ortho" },
      { label: "Khóa implant", next: "course_implant" },
      { label: "Khóa tổng quát", next: "course_general" },
      { label: "Lịch khai giảng", next: "course_schedule" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // 1.1 Chỉnh nha
  course_ortho: {
    botMessages: [
      "Khóa chỉnh nha giúp học viên nắm vững từ cơ bản đến nâng cao.\n\nBạn muốn biết thêm thông tin nào?",
    ],
    options: [
      { label: "Nội dung khóa học", next: "ortho_content" },
      { label: "Học phí", next: "ortho_fee" },
      { label: "Thời gian học", next: "ortho_schedule" },
      { label: "Đăng ký ngay", next: "ortho_register" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  ortho_content: {
    botMessages: [
      "Khóa học bao gồm:\n- Kiến thức nền tảng\n- Thực hành trên mẫu\n- Phân tích case thực tế\n- Hướng dẫn quy trình điều trị",
    ],
    options: [
      { label: "Học phí", next: "ortho_fee" },
      { label: "Thời gian học", next: "ortho_schedule" },
      { label: "Đăng ký ngay", next: "ortho_register" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  ortho_fee: {
    botMessages: [
      "Học phí sẽ tùy theo chương trình cụ thể và thời điểm khai giảng.\n\nBạn muốn chọn bước tiếp theo nào?",
    ],
    options: [
      { label: "Thời gian học", next: "ortho_schedule" },
      { label: "Đăng ký ngay", next: "ortho_register" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  ortho_schedule: {
    botMessages: [
      "Lịch học được sắp xếp linh hoạt theo từng khóa, có thông báo khai giảng cụ thể trước mỗi đợt.",
    ],
    options: [
      { label: "Học phí", next: "ortho_fee" },
      { label: "Đăng ký ngay", next: "ortho_register" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  ortho_register: {
    botMessages: [
      "Bạn vui lòng để lại:\n- Họ tên\n- Số điện thoại\n- Khóa học quan tâm\n\nHD Dental sẽ liên hệ hỗ trợ đăng ký sớm nhất.",
    ],
    options: [
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // 1.2 Implant
  course_implant: {
    botMessages: [
      "Khóa implant phù hợp với học viên muốn nâng cao kiến thức chuyên sâu và thực hành lâm sàng.",
    ],
    options: [
      { label: "Nội dung khóa học", next: "implant_content" },
      { label: "Học phí", next: "implant_fee" },
      { label: "Thời gian học", next: "implant_schedule" },
      { label: "Đăng ký ngay", next: "implant_register" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  implant_content: {
    botMessages: [
      "Nội dung nổi bật gồm:\n- Kiến thức nền implant\n- Chỉ định và chống chỉ định\n- Lập kế hoạch điều trị\n- Thực hành case",
    ],
    options: [
      { label: "Học phí", next: "implant_fee" },
      { label: "Thời gian học", next: "implant_schedule" },
      { label: "Đăng ký ngay", next: "implant_register" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  implant_fee: {
    botMessages: [
      "Học phí khóa implant sẽ được tư vấn chi tiết theo từng chương trình đào tạo và cấp độ học.",
    ],
    options: [
      { label: "Thời gian học", next: "implant_schedule" },
      { label: "Đăng ký ngay", next: "implant_register" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  implant_schedule: {
    botMessages: [
      "Khóa học thường được tổ chức theo từng đợt và có lịch cụ thể để học viên sắp xếp thời gian.",
    ],
    options: [
      { label: "Học phí", next: "implant_fee" },
      { label: "Đăng ký ngay", next: "implant_register" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  implant_register: {
    botMessages: [
      "Bạn hãy để lại thông tin đăng ký, HD Dental sẽ liên hệ hỗ trợ chi tiết.",
    ],
    options: [
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // 1.3 Tổng quát
  course_general: {
    botMessages: [
      "Khóa tổng quát phù hợp cho người muốn củng cố nền tảng và cập nhật kiến thức thực hành nha khoa.",
    ],
    options: [
      { label: "Nội dung khóa học", next: "general_content" },
      { label: "Học phí", next: "general_fee" },
      { label: "Thời gian học", next: "general_schedule" },
      { label: "Đăng ký ngay", next: "general_register" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  general_content: {
    botMessages: [
      "Khóa học tập trung vào kiến thức nền, quy trình cơ bản và kỹ năng thực hành tổng quát.",
    ],
    options: [
      { label: "Học phí", next: "general_fee" },
      { label: "Thời gian học", next: "general_schedule" },
      { label: "Đăng ký ngay", next: "general_register" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  general_fee: {
    botMessages: [
      "HD Dental sẽ tư vấn mức học phí phù hợp theo chương trình và thời gian đăng ký.",
    ],
    options: [
      { label: "Thời gian học", next: "general_schedule" },
      { label: "Đăng ký ngay", next: "general_register" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  general_schedule: {
    botMessages: [
      "Khóa tổng quát có thể được tổ chức theo lịch cố định hoặc theo từng đợt đào tạo.",
    ],
    options: [
      { label: "Học phí", next: "general_fee" },
      { label: "Đăng ký ngay", next: "general_register" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  general_register: {
    botMessages: [
      "Bạn vui lòng để lại thông tin để HD Dental hỗ trợ đăng ký khóa tổng quát.",
    ],
    options: [
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // 1.4 Lịch khai giảng
  course_schedule: {
    botMessages: [
      "Lịch khai giảng sẽ được HD Dental cập nhật theo từng khóa học và từng đợt đào tạo.",
    ],
    options: [
      { label: "Khóa chỉnh nha", next: "course_ortho" },
      { label: "Khóa implant", next: "course_implant" },
      { label: "Khóa tổng quát", next: "course_general" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // ── NHÁNH 2: SẢN PHẨM ────────────────────────────────────
  product_menu: {
    botMessages: [
      "HD Dental cung cấp nhiều thiết bị và vật liệu nha khoa chính hãng.\n\nBạn đang quan tâm nhóm nào ạ?",
    ],
    options: [
      { label: "Thiết bị nha khoa", next: "device_menu" },
      { label: "Vật liệu nha khoa", next: "material_menu" },
      { label: "Combo phòng khám", next: "combo_menu" },
      { label: "Báo giá", next: "product_quote" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // 2.1 Thiết bị
  device_menu: {
    botMessages: ["Bạn đang tìm loại thiết bị nào?"],
    options: [
      { label: "Ghế nha khoa", next: "device_chair" },
      { label: "Máy X-quang", next: "device_xray" },
      { label: "Tay khoan", next: "device_handpiece" },
      { label: "Khác", next: "device_other" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  device_chair: {
    botMessages: [
      "Hiện tại bên mình có nhiều dòng ghế nha khoa hiện đại, phù hợp nhiều mô hình phòng khám.",
    ],
    options: [
      { label: "Xem mẫu", next: "chair_sample" },
      { label: "Xem giá", next: "chair_price" },
      { label: "Tư vấn chi tiết", next: "chair_consult" },
      { label: "Đặt lịch demo", next: "chair_demo" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  chair_sample: {
    botMessages: [
      "HD Dental có thể gửi bạn thông tin mẫu ghế phù hợp theo nhu cầu sử dụng.",
    ],
    options: [
      { label: "Xem giá", next: "chair_price" },
      { label: "Tư vấn chi tiết", next: "chair_consult" },
      { label: "Đặt lịch demo", next: "chair_demo" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  chair_price: {
    botMessages: [
      "Giá sẽ thay đổi theo model, cấu hình và chương trình hỗ trợ tại thời điểm tư vấn.",
    ],
    options: [
      { label: "Tư vấn chi tiết", next: "chair_consult" },
      { label: "Đặt lịch demo", next: "chair_demo" },
      { label: "Nhận báo giá nhanh", next: "quick_quote" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  chair_consult: {
    botMessages: [
      "Bạn vui lòng cho biết nhu cầu sử dụng hoặc quy mô phòng khám để HD Dental tư vấn phù hợp hơn.",
    ],
    options: [
      { label: "Nhận báo giá nhanh", next: "quick_quote" },
      { label: "Đặt lịch demo", next: "chair_demo" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  chair_demo: {
    botMessages: [
      "Bạn vui lòng để lại:\n- Họ tên\n- Số điện thoại\n- Sản phẩm quan tâm\n\nHD Dental sẽ liên hệ sắp xếp lịch demo.",
    ],
    options: [
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  quick_quote: {
    botMessages: [
      "Bạn vui lòng để lại thông tin liên hệ, HD Dental sẽ gửi báo giá nhanh nhất.",
    ],
    options: [
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  device_xray: {
    botMessages: [
      "HD Dental có các giải pháp máy X-quang hỗ trợ chẩn đoán hiệu quả cho phòng khám.",
    ],
    options: [
      { label: "Xem mẫu", next: "xray_sample" },
      { label: "Xem giá", next: "xray_price" },
      { label: "Tư vấn chi tiết", next: "xray_consult" },
      { label: "Đặt lịch demo", next: "chair_demo" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  xray_sample: {
    botMessages: [
      "HD Dental có thể gửi thông tin chi tiết về các mẫu máy X-quang theo nhu cầu của bạn.",
    ],
    options: [
      { label: "Xem giá", next: "xray_price" },
      { label: "Tư vấn chi tiết", next: "xray_consult" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  xray_price: {
    botMessages: [
      "Giá máy X-quang thay đổi theo dòng máy và cấu hình. HD Dental sẽ tư vấn chi tiết khi bạn liên hệ.",
    ],
    options: [
      { label: "Tư vấn chi tiết", next: "xray_consult" },
      { label: "Nhận báo giá nhanh", next: "quick_quote" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  xray_consult: {
    botMessages: [
      "Bạn vui lòng cho biết nhu cầu sử dụng để HD Dental tư vấn dòng máy X-quang phù hợp.",
    ],
    options: [
      { label: "Nhận báo giá nhanh", next: "quick_quote" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  device_handpiece: {
    botMessages: [
      "HD Dental có nhiều dòng tay khoan phù hợp nhu cầu điều trị và vận hành hằng ngày.",
    ],
    options: [
      { label: "Xem mẫu", next: "handpiece_info" },
      { label: "Xem giá", next: "handpiece_info" },
      { label: "Tư vấn chi tiết", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  handpiece_info: {
    botMessages: [
      "HD Dental sẽ gửi thông tin chi tiết về tay khoan theo nhu cầu của bạn.",
    ],
    options: [
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  device_other: {
    botMessages: [
      "Bạn có thể nhập tên sản phẩm bạn đang quan tâm để HD Dental hỗ trợ chính xác hơn.",
    ],
    options: [
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // 2.2 Vật liệu
  material_menu: {
    botMessages: ["Bạn muốn tìm hiểu nhóm vật liệu nào?"],
    options: [
      { label: "Vật liệu phục hình", next: "mat_restoration" },
      { label: "Vật liệu điều trị", next: "mat_treatment" },
      { label: "Vật tư tiêu hao", next: "mat_consumable" },
      { label: "Báo giá vật liệu", next: "mat_quote" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  mat_restoration: {
    botMessages: [
      "HD Dental có thể tư vấn các nhóm vật liệu phục hình phù hợp với nhu cầu sử dụng của phòng khám.",
    ],
    options: [
      { label: "Báo giá vật liệu", next: "mat_quote" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  mat_treatment: {
    botMessages: [
      "HD Dental hỗ trợ tư vấn các vật liệu điều trị theo mục đích sử dụng và hiệu quả lâm sàng.",
    ],
    options: [
      { label: "Báo giá vật liệu", next: "mat_quote" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  mat_consumable: {
    botMessages: [
      "Bạn có thể chọn nhóm vật tư cần hỗ trợ để bên mình tư vấn nhanh hơn.",
    ],
    options: [
      { label: "Báo giá vật liệu", next: "mat_quote" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  mat_quote: {
    botMessages: [
      "Bạn vui lòng để lại danh sách hoặc nhu cầu sử dụng, HD Dental sẽ hỗ trợ báo giá phù hợp.",
    ],
    options: [
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // 2.3 Combo
  combo_menu: {
    botMessages: [
      "HD Dental có thể tư vấn giải pháp combo thiết bị phù hợp cho phòng khám mới hoặc nâng cấp.",
    ],
    options: [
      { label: "Combo cơ bản", next: "combo_basic" },
      { label: "Combo nâng cao", next: "combo_advanced" },
      { label: "Báo giá combo", next: "combo_quote" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  combo_basic: {
    botMessages: [
      "Combo cơ bản phù hợp phòng khám cần triển khai các hạng mục thiết yếu ban đầu.",
    ],
    options: [
      { label: "Báo giá combo", next: "combo_quote" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  combo_advanced: {
    botMessages: [
      "Combo nâng cao phù hợp phòng khám cần đồng bộ thiết bị và tối ưu vận hành chuyên sâu hơn.",
    ],
    options: [
      { label: "Báo giá combo", next: "combo_quote" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  combo_quote: {
    botMessages: [
      "Bạn vui lòng cho biết mô hình phòng khám và nhu cầu đầu tư để HD Dental tư vấn gói phù hợp.",
    ],
    options: [
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // 2.4 Báo giá
  product_quote: {
    botMessages: [
      "HD Dental sẽ hỗ trợ báo giá theo nhu cầu thực tế để đảm bảo phù hợp hơn cho bạn.",
    ],
    options: [
      { label: "Thiết bị nha khoa", next: "device_menu" },
      { label: "Vật liệu nha khoa", next: "material_menu" },
      { label: "Combo phòng khám", next: "combo_menu" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Quay lại", next: "__back__", variant: "nav" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // ── NHÁNH 3: ĐĂNG KÝ TƯ VẤN ─────────────────────────────
  register_menu: {
    botMessages: [
      "HD Dental sẽ hỗ trợ bạn nhanh nhất có thể.\n\nBạn muốn được tư vấn theo hình thức nào?",
    ],
    options: [
      { label: "Gọi điện", next: "register_call" },
      { label: "Tư vấn tại phòng khám", next: "register_clinic" },
      { label: "Để lại thông tin", next: "leave_info" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  register_call: {
    botMessages: [
      "Bạn vui lòng để lại số điện thoại, nhân viên HD Dental sẽ gọi lại sớm cho bạn.",
    ],
    options: [
      { label: "Để lại thông tin", next: "leave_info" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  register_clinic: {
    botMessages: [
      "Bạn vui lòng để lại thời gian mong muốn và nhu cầu tư vấn để HD Dental sắp xếp lịch phù hợp.",
    ],
    options: [
      { label: "Để lại thông tin", next: "leave_info" },
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
  leave_info: {
    botMessages: [
      "Bạn vui lòng nhập:\n- Họ tên\n- Số điện thoại\n- Nhu cầu cần tư vấn\n\nHD Dental sẽ liên hệ lại trong thời gian sớm nhất.",
    ],
    options: [
      { label: "Gặp tư vấn viên", next: "consultant" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },

  // ── GẶP TƯ VẤN VIÊN ──────────────────────────────────────
  consultant: {
    botMessages: [
      "Bạn vui lòng để lại thông tin liên hệ, HD Dental sẽ kết nối tư vấn viên hỗ trợ bạn sớm nhất.",
    ],
    options: [
      { label: "Để lại thông tin", next: "leave_info" },
      { label: "Về menu chính", next: "main_menu", variant: "nav" },
    ],
  },
};

// ============================================================
// HELPER – create message object
// ============================================================
let _msgId = 100;
const mkMsg = (speaker, text) => ({ id: ++_msgId, speaker, text });

// ============================================================
// COMPONENT
// ============================================================
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    mkMsg("bot", FLOW.main_menu.botMessages[0]),
  ]);
  const [currentStep, setCurrentStep] = useState("main_menu");
  const [history, setHistory] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // current options from flow
  const currentOptions = FLOW[currentStep]?.options ?? [];

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ── Core navigation ──────────────────────────────────────
  const goToStep = useCallback(
    (targetStep, fromStep) => {
      if (targetStep === "main_menu") {
        // Reset to root
        setHistory([]);
        setCurrentStep("main_menu");
        const step = FLOW.main_menu;
        setMessages((prev) => [
          ...prev,
          ...step.botMessages.map((t) => mkMsg("bot", t)),
        ]);
        return;
      }

      if (targetStep === "__back__") {
        if (history.length === 0) {
          goToStep("main_menu");
          return;
        }
        const newHistory = [...history];
        const prev = newHistory.pop();
        setHistory(newHistory);
        setCurrentStep(prev);
        const step = FLOW[prev];
        if (step) {
          setMessages((prev2) => [
            ...prev2,
            ...step.botMessages.map((t) => mkMsg("bot", t)),
          ]);
        }
        return;
      }

      const step = FLOW[targetStep];
      if (!step) return;

      setHistory((h) => [...h, fromStep]);
      setCurrentStep(targetStep);
      setMessages((prev) => [
        ...prev,
        ...step.botMessages.map((t) => mkMsg("bot", t)),
      ]);
    },
    [history]
  );

  // ── Option click ─────────────────────────────────────────
  const handleOptionClick = useCallback(
    (option) => {
      // Add user message
      setMessages((prev) => [...prev, mkMsg("user", option.label)]);

      // Handle action (e.g. open link) — do this first then navigate
      if (option.action?.type === "open_link") {
        window.open(option.action.url, "_blank");
      }

      // Navigate
      goToStep(option.next, currentStep);
    },
    [currentStep, goToStep]
  );

  // ── Input send ───────────────────────────────────────────
  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      mkMsg("user", trimmed),
      mkMsg(
        "bot",
        "HD Dental đã nhận được thông tin của bạn và sẽ phản hồi sớm nhất."
      ),
    ]);
    setInputValue("");
  }, [inputValue]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Option button style ──────────────────────────────────
  const optionClass = (variant) => {
    if (variant === "nav") {
      return "text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 font-medium";
    }
    return "text-xs px-3 py-1.5 rounded-full border border-red-300 text-red-600 bg-white hover:bg-red-50 hover:border-red-400 transition-all duration-150 font-medium";
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-3">
      {/* ── Popup ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-popup"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-[340px] max-w-[calc(100vw-40px)] rounded-2xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col bg-white"
            style={{ maxHeight: "540px" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, #e01a22 0%, #c0141b 100%)",
              }}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 border-2 border-white/30">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                  <path
                    d="M7 17c0-2.761 2.239-5 5-5s5 2.239 5 5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="9" r="3.5" fill="white" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">
                  HD Dental
                </p>
                <p className="text-white/80 text-xs flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-green-300" />
                  Online
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all duration-150"
                aria-label="Đóng chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-gray-50"
              style={{ minHeight: "180px", maxHeight: "260px" }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.speaker === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.speaker === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5">
                        <path
                          d="M7 17c0-2.761 2.239-5 5-5s5 2.239 5 5"
                          stroke="#e01a22"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <circle cx="12" cy="9" r="3" fill="#e01a22" />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`max-w-[220px] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${msg.speaker === "user"
                      ? "bg-[#e01a22] text-white rounded-tr-sm"
                      : "bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100"
                      }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick options */}
            {currentOptions.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-1.5">
                {currentOptions.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleOptionClick(opt)}
                    className={optionClass(opt.variant)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input area */}
            <div className="px-3 py-2.5 bg-white border-t border-gray-100 flex items-center gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tin nhắn..."
                className="flex-1 text-sm px-3 py-2 rounded-full border border-gray-200 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all duration-150 bg-gray-50"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-150 flex-shrink-0 disabled:opacity-40"
                style={{
                  background:
                    "linear-gradient(135deg, #e01a22 0%, #c0141b 100%)",
                }}
                aria-label="Gửi tin nhắn"
              >
                <Send size={15} />
              </button>
            </div>

            {/* Footer */}
            <div className="px-4 py-1.5 text-center bg-white border-t border-gray-50 flex-shrink-0">
              <p className="text-[10px] text-gray-400">
                HD Dental luôn sẵn sàng hỗ trợ bạn 24/7
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle button ── */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
        style={{
          background: "linear-gradient(135deg, #e01a22 0%, #c0141b 100%)",
          boxShadow: "0 4px 20px rgba(224,26,34,0.45)",
        }}
        aria-label={isOpen ? "Đóng chat" : "Mở chat tư vấn"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
