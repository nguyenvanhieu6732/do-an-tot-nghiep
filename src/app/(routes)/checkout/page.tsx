import Link from "next/link"
import { Check, ChevronRight, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function CheckoutSuccessPage() {
  // Dữ liệu đơn hàng mẫu - trong ứng dụng thực tế, bạn sẽ lấy dữ liệu này từ API
  const orderData = {
    id: "ORD-12345",
    date: "08/04/2025",
    total: "2.999.000₫",
    items: [
      { name: "Áo thun cao cấp", quantity: 2, price: "499.000₫", total: "998.000₫" },
      { name: "Quần jean thiết kế", quantity: 1, price: "1.999.000₫", total: "1.999.000₫" },
    ],
    shipping: {
      method: "Giao hàng tiêu chuẩn",
      address: "123 Đường Nguyễn Văn A, Quận 1, TP.HCM",
      estimatedDelivery: "12-15/04/2025",
    },
    payment: {
      method: "Thẻ tín dụng",
      last4: "4242",
    },
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="container max-w-4xl py-10 px-4">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Cảm ơn bạn đã đặt hàng!</h1>
        <p className="text-muted-foreground text-lg">Đơn hàng #{orderData.id} đã được đặt thành công.</p>
        <p className="text-muted-foreground">Email xác nhận đã được gửi đến địa chỉ email của bạn.</p>
      </div>

      <Card className="mb-8 shadow-sm">
        <CardHeader className="bg-muted/30">
        <CardTitle className="text-xl">Tóm tắt đơn hàng</CardTitle>
        <CardDescription>Đơn hàng đặt ngày {orderData.date}</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Danh sách sản phẩm */}
          {orderData.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">Số lượng: {item.quantity}</p>
            </div>
            <div className="text-right">
            <p className="font-medium">{item.total}</p>
            <p className="text-sm text-muted-foreground">{item.price} / sản phẩm</p>
            </div>
          </div>
          ))}

          <Separator className="my-2" />

          {/* Tổng cộng */}
          <div className="flex justify-between font-medium text-lg">
          <p>Tổng cộng</p>
          <p>{orderData.total}</p>
          </div>
        </div>
        </CardContent>
      </Card>

      {/* Thông tin giao hàng và thanh toán */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="shadow-sm">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-lg">Thông tin giao hàng</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
          <p className="font-medium">Địa chỉ giao hàng:</p>
          <p>{orderData.shipping.address}</p>
          <p className="text-sm text-muted-foreground">Phương thức: {orderData.shipping.method}</p>
          <p className="text-sm text-muted-foreground">Dự kiến giao hàng: {orderData.shipping.estimatedDelivery}</p>
          </div>
        </CardContent>
        </Card>

        <Card className="shadow-sm">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-lg">Thông tin thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
          <p className="font-medium">Phương thức thanh toán:</p>
          <p>{orderData.payment.method}</p>
          <p className="text-sm text-muted-foreground">Số cuối {orderData.payment.last4}</p>
          </div>
        </CardContent>
        </Card>
      </div>

      {/* Các nút điều hướng */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" asChild>
        <Link href={`/orders/${orderData.id}`}>
          Xem chi tiết đơn hàng
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
        <Link href="/orders">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Xem tất cả đơn hàng
        </Link>
        </Button>
      </div>
      </div>
    </div>
  )
}
