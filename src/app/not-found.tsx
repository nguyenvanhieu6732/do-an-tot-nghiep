"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
      <p className="text-gray-500 mt-2">Bạn không có quyền truy cập trang này.</p>
      <button
        onClick={() => router.push("/")}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Quay về trang chủ
      </button>
    </div>
  );
}
