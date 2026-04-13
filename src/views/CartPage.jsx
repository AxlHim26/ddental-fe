"use client";

import { Link } from "react-router-dom";
import { Minus, Phone, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/hd-dental/Navbar";
import Footer from "@/components/hd-dental/Footer";

function formatPrice(price) {
  if (price >= 1000000) return `${(price / 1000000).toFixed(0)} triệu ₫`;
  return `${price.toLocaleString("vi")} ₫`;
}

export default function CartPage() {
  const {
    cartItems,
    itemCount,
    subtotal,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      <div className="border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center gap-2 font-body text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span>/</span>
          <span className="text-foreground">Giỏ hàng</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 mt-24 lg:mt-28">
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground">
            Giỏ hàng của bạn
          </h1>
          <p className="font-body text-sm text-muted-foreground">
            {itemCount > 0
              ? `${itemCount} sản phẩm đang chờ xác nhận đặt hàng.`
              : "Chưa có sản phẩm nào trong giỏ hàng."}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShoppingCart className="h-7 w-7" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">
              Giỏ hàng đang trống
            </h2>
            <p className="mx-auto mt-3 max-w-xl font-body text-sm leading-relaxed text-muted-foreground">
              Hãy thêm một vài thiết bị nha khoa để lưu lại nhu cầu mua sắm và
              gửi yêu cầu báo giá nhanh hơn.
            </p>
            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              <ShoppingCart className="w-4 h-4" />
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {cartItems.map(({ product, quantity, lineTotal }) => (
                <div
                  key={product.id}
                  className="rounded-3xl border border-border bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                      to={`/product/${product.id}`}
                      className="h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-muted/30 sm:w-28"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                            {product.brand}
                          </p>
                          <Link
                            to={`/product/${product.id}`}
                            className="mt-1 block font-heading text-xl font-bold text-foreground hover:text-primary transition-colors"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-1 font-body text-sm text-muted-foreground">
                            {product.inStock ? "Còn hàng" : "Tạm hết hàng"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="inline-flex items-center gap-2 self-start rounded-full border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>

                      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="inline-flex h-12 items-center justify-between rounded-2xl border border-border bg-muted/30 px-2 w-[154px]">
                          <button
                            type="button"
                            onClick={() =>
                              updateItemQuantity(product.id, quantity - 1)
                            }
                            disabled={quantity <= 1}
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-heading text-base font-bold text-foreground">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateItemQuantity(product.id, quantity + 1)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground transition-colors hover:bg-background"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="font-body text-sm text-muted-foreground">
                            Đơn giá: {formatPrice(product.price)}
                          </p>
                          <p className="font-heading text-xl font-bold text-primary">
                            {formatPrice(lineTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside className="lg:sticky lg:top-28 h-fit rounded-3xl border border-border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Tóm tắt đơn hàng
                </h2>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-4 py-5">
                <div className="flex items-center justify-between font-body text-sm text-muted-foreground">
                  <span>Số lượng sản phẩm</span>
                  <span className="font-semibold text-foreground">
                    {itemCount}
                  </span>
                </div>
                <div className="flex items-center justify-between font-body text-sm text-muted-foreground">
                  <span>Tạm tính</span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between font-body text-base font-semibold text-foreground pt-4 border-t border-border">
                  <span>Tổng giá trị tham khảo</span>
                  <span className="font-heading text-2xl text-primary">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <p className="rounded-2xl bg-muted/30 px-4 py-3 font-body text-xs leading-relaxed text-muted-foreground">
                Giá trên website là giá tham khảo. Đội ngũ HD Dental sẽ liên hệ
                để xác nhận cấu hình, ưu đãi và chi phí lắp đặt thực tế.
              </p>

              <div className="mt-5 space-y-3">
                <a
                  href="tel:0914233030"
                  className="w-full bg-primary text-white font-heading font-bold text-base py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Gọi đặt hàng (0914 233 030)
                </a>
              </div>
            </aside>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
