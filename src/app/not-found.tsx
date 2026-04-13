import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-7xl font-light text-slate-300">404</h1>
          <div className="mx-auto h-0.5 w-16 bg-slate-200" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-medium text-slate-800">
            Không tìm thấy trang
          </h2>
          <p className="leading-relaxed text-slate-600">
            Đường dẫn bạn đang mở hiện không tồn tại trong website này.
          </p>
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
