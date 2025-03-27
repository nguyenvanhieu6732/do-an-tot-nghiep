import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Tạo một hàm kiểm tra xem route có được bảo vệ hay không
const isProtectedRoute = createRouteMatcher(['/admin(.*)'])

// Sử dụng middleware của Clerk để bảo vệ các route
export default clerkMiddleware(async (auth, req) => {
  // Nếu route được bảo vệ, yêu cầu người dùng đăng nhập
  if (isProtectedRoute(req)) await auth.protect()
})

// Cấu hình matcher để xác định các route nào sẽ sử dụng middleware
export const config = {
  matcher: [
    // Bỏ qua các file tĩnh và các file nội bộ của Next.js, trừ khi chúng được tìm thấy trong tham số tìm kiếm
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Luôn chạy middleware cho các route API
    '/(api|trpc)(.*)',
  ],
}