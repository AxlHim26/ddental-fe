import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { E, Reveal } from "@/lib/animations";

const faqs = [
  {
    q: "HD Dental cung cấp những loại sản phẩm nào?",
    a: "Chúng tôi cung cấp đa dạng thiết bị nha khoa bao gồm: ghế nha khoa, đèn trám composite, máy chụp X-quang kỹ thuật số, dụng cụ phẫu thuật, vật liệu nha khoa và nhiều sản phẩm chuyên dụng khác từ các thương hiệu hàng đầu thế giới.",
  },
  {
    q: "Chính sách bảo hành và hậu mãi như thế nào?",
    a: "Tất cả sản phẩm đều được bảo hành chính hãng từ 12-36 tháng tùy loại. Đội ngũ kỹ thuật của chúng tôi sẵn sàng hỗ trợ 24/7, với thời gian phản hồi dưới 4 giờ cho khu vực TP.HCM và Hà Nội.",
  },
  {
    q: "Có hỗ trợ tư vấn thiết kế phòng khám không?",
    a: "Có, HD Dental cung cấp dịch vụ tư vấn và thiết kế phòng khám trọn gói. Đội ngũ kiến trúc sư chuyên ngành y tế sẽ hỗ trợ bạn từ khâu lên ý tưởng, thiết kế 3D đến giám sát thi công.",
  },
  {
    q: "Làm thế nào để đăng ký các khóa đào tạo tại HD Academy?",
    a: "Bạn có thể đăng ký trực tiếp trên website hoặc liên hệ hotline. Chúng tôi tổ chức các khóa đào tạo hàng tháng với giảng viên trong nước và quốc tế, phù hợp cho cả nha sĩ mới ra trường và có kinh nghiệm.",
  },
  {
    q: "HD Dental có hỗ trợ thanh toán trả góp không?",
    a: "Có, chúng tôi hợp tác với nhiều ngân hàng và tổ chức tài chính để cung cấp gói trả góp 0% lãi suất lên đến 24 tháng cho các thiết bị có giá trị từ 20 triệu đồng trở lên.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 lg:py-32 bg-background overflow-hidden">
      <div className="max-w-3xl mx-auto px-8 lg:px-16">
        {/* Heading */}
        <Reveal className="text-center mb-14">
          <span className="font-body text-primary text-xs font-bold uppercase tracking-[0.3em] mb-3 block">Hỗ trợ</span>
          <h2 className="font-heading font-black text-4xl md:text-5xl text-foreground leading-tight">
            CÂU HỎI <span className="text-primary">THƯỜNG GẶP</span>
          </h2>
          <div className="w-12 h-1 bg-primary rounded-full mx-auto mt-5" />
        </Reveal>

        {/* Accordions */}
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: E }}
            >
              <AccordionItem
                value={`item-${i}`}
                className="border border-border rounded-2xl px-6 data-[state=open]:border-primary/30 data-[state=open]:shadow-lg data-[state=open]:shadow-primary/5 transition-all duration-300 overflow-hidden"
              >
                <AccordionTrigger className="font-body font-semibold text-foreground text-left hover:no-underline hover:text-primary py-5 gap-4">
                  <div className="flex items-center gap-4">
                    <span className="font-heading font-black text-primary/30 text-sm flex-shrink-0 w-7">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{faq.q}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground leading-relaxed pb-5 pl-11">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}