import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/formatPrice"

export const metadata = {
  title: "Giỏ hàng - LUXMEN",
  description: "Giỏ hàng của bạn tại LUXMEN",
}

export default function CartPage() {
  // Giả lập dữ liệu giỏ hàng
  const cartItems = [
    {
      id: 1,
      name: "Áo sơ mi Oxford",
      price: 850000,
      quantity: 1,
      color: "Trắng",
      size: "L",
      image: "/placeholder.svg?height=600&width=400",
      link: "/products/oxford-shirt",
    },
    {
      id: 2,
      name: "Quần Chinos Slim-fit",
      price: 750000,
      quantity: 1,
      color: "Xanh navy",
      size: "M",
      image: "/placeholder.svg?height=600&width=400",
      link: "/products/slim-fit-chinos",
    },
  ]

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 30000
  const total = subtotal + shipping

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted text-sm font-medium">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-center">Tổng</div>
              </div>

              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Product */}
                      <div className="col-span-6 flex gap-4">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <Link href={item.link} className="font-medium hover:text-primary transition-colors">
                            {item.name}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1">
                            <div>Màu: {item.color}</div>
                            <div>Size: {item.size}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 p-0 text-muted-foreground hover:text-destructive sm:hidden mt-2"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <div className="sm:hidden text-sm text-muted-foreground mb-1">Giá:</div>
                        {formatPrice(item.price)}
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2">
                        <div className="sm:hidden text-sm text-muted-foreground mb-1">Số lượng:</div>
                        <div className="flex items-center justify-center">
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-r-none">
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Giảm</span>
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button variant="outline" size="icon" className="h-8 w-8 rounded-l-none">
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Tăng</span>
                          </Button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-2 text-center font-medium">
                        <div className="sm:hidden text-sm text-muted-foreground mb-1">Tổng:</div>
                        {formatPrice(item.price * item.quantity)}
                      </div>

                      {/* Remove button (desktop) */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-4 h-8 w-8 text-muted-foreground hover:text-destructive hidden sm:flex"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Xóa</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="flex gap-2 w-full sm:w-auto">
                <Input placeholder="Mã giảm giá" className="w-full sm:w-auto" />
                <Button variant="outline">Áp dụng</Button>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products">Tiếp tục mua sắm</Link>
              </Button>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phí vận chuyển</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-medium">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Thanh toán</Link>
              </Button>

              <div className="mt-6 text-sm text-muted-foreground">
                <p>Chúng tôi chấp nhận các phương thức thanh toán sau:</p>
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-10 bg-muted rounded"></div>
                  <div className="h-6 w-10 bg-muted rounded"></div>
                  <div className="h-6 w-10 bg-muted rounded"></div>
                  <div className="h-6 w-10 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-muted-foreground mb-6">Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng.</p>
          <Button asChild>
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

