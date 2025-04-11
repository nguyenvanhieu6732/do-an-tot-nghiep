import Link from "next/link"
import { Check, ChevronRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function CheckoutSuccessPage() {
  // Dữ liệu đơn hàng mẫu - trong ứng dụng thực tế, bạn sẽ lấy dữ liệu này từ API


  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container max-w-4xl py-10 px-4">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Cảm ơn bạn đã đặt hàng!</h1>
        <p className="text-muted-foreground text-lg">Đơn hàng đã được đặt thành công.</p>
      </div>

      {/* Các nút điều hướng */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" asChild>
        <Link href={`/orders`}>
        Xem tất cả đơn hàng
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
        <Link href="/">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Quay về trang chủ
        </Link>
        </Button>
      </div>
      </div>
    </div>
  )
}
