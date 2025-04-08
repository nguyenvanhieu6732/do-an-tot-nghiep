"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Loading from "../loading";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";


export default function CartClient() {
  const { userId, isLoaded } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false);
  const [recipientName, setRecipientName] = useState<string>("");
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [ward, setWard] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [phone, setPhone] = useState<string>("");

  // Lấy danh sách tỉnh/thành phố khi component mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách tỉnh/thành phố:", err);
      }
    };
    fetchProvinces();
  }, []);

  // Lấy danh sách quận/huyện khi chọn tỉnh/thành phố
  useEffect(() => {
    if (province) {
      const fetchDistricts = async () => {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/p/${province}?depth=2`
          );
          const data = await response.json();
          setDistricts(data.districts);
          setDistrict(""); // Reset quận/huyện khi thay đổi tỉnh
          setWards([]); // Reset xã/phường
          setWard("");
        } catch (err) {
          console.error("Lỗi khi lấy danh sách quận/huyện:", err);
        }
      };
      fetchDistricts();
    }
  }, [province]);

  // Lấy danh sách xã/phường khi chọn quận/huyện
  useEffect(() => {
    if (district) {
      const fetchWards = async () => {
        try {
          const response = await fetch(
            `https://provinces.open-api.vn/api/d/${district}?depth=2`
          );
          const data = await response.json();
          setWards(data.wards);
          setWard(""); // Reset xã/phường khi thay đổi quận/huyện
        } catch (err) {
          console.error("Lỗi khi lấy danh sách xã/phường:", err);
        }
      };
      fetchWards();
    }
  }, [district]);

  const fetchCartItems = async () => {
    if (!userId) {
      setError("Vui lòng đăng nhập để xem giỏ hàng");
      setLoading(false);
      return;
    }

    try {
      const cartResponse = await fetch(`/api/cart?userId=${userId}`);
      if (!cartResponse.ok) {
        throw new Error("Không thể tải giỏ hàng");
      }
      const cartData = await cartResponse.json();

      const updatedItems = await Promise.all(
        cartData.map(async (item: any) => {
          let imageUrl = null;
          if (item.productId) {
            try {
              const productResponse = await fetch(`/api/products/${item.productId}`);
              if (productResponse.ok) {
                const productData = await productResponse.json();
                imageUrl = productData.image || null;
                if (imageUrl && !imageUrl.startsWith("data:image")) {
                  imageUrl = `data:image/jpeg;base64,${imageUrl}`;
                }
              }
            } catch (err) {
              console.error(`Lỗi khi lấy ảnh cho sản phẩm ${item.productId}:`, err);
            }
          }
          return { ...item, imageUrl };
        })
      );

      setCartItems(updatedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    fetchCartItems();
  }, [userId, isLoaded]);

  const handleQuantityChange = async (id: string, newQuantity: string) => {
    const parsedQuantity = parseInt(newQuantity);
    const validQuantity = isNaN(parsedQuantity) ? 1 : Math.max(1, parsedQuantity);

    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: validQuantity }),
      });

      if (!response.ok) {
        throw new Error("Không thể cập nhật số lượng");
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, quantity: validQuantity } : item
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
    }
  };

  const handleRemoveItem = async (id: string) => {
    try {
      const response = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Không thể xóa sản phẩm");
      }

      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
    }
  };

  const handleCheckoutClick = () => {
    if (!userId) {
      setError("Vui lòng đăng nhập để thanh toán");
      return;
    }
    setError(null);
    setIsCheckoutDialogOpen(true);
  };

  const handleConfirmCheckout = async () => {
    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán");
      return;
    }
    if (!recipientName) {
      setError("Vui lòng nhập tên người nhận");
      return;
    }
    if (!province || !district || !ward || !street) {
      setError("Vui lòng nhập đầy đủ thông tin địa chỉ");
      return;
    }

    const fullAddress = `${street}, ${wards.find(w => w.code === ward)?.name}, ${districts.find(d => d.code === district)?.name}, ${provinces.find(p => p.code === province)?.name}`;

    setOrderLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          paymentMethod,
          address: fullAddress,
          name: recipientName,
          phone: phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          typeof errorData.error === "string"
            ? errorData.error
            : errorData.error?.message || JSON.stringify(errorData.error) || "Không thể tạo đơn hàng";
        throw new Error(errorMessage);
      }

      const order = await response.json();
      setCartItems([]);
      setIsCheckoutDialogOpen(false);
      toast.success("Thành công", {
        description: "Đơn hàng đã được đặt thành công!",
        action: {
          label: "Xem tất cả đơn hàng",
          onClick: () => window.location.href = "/checkout",
        },
      });
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      setError(
        error instanceof Error ? error.message : "Đã xảy ra lỗi khi thanh toán"
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);

  const subtotal = cartItems.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = 30000;
  const total = subtotal + shipping;

  if (!isLoaded || loading) return <Loading />;
  if (error && !isCheckoutDialogOpen) return <div className="text-red-500 text-center py-16">{error}</div>;

  return (
    <>
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="border rounded-lg overflow-hidden">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-muted text-sm font-medium">
                <div className="col-span-5">Sản phẩm</div>
                <div className="col-span-2 text-center">Giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-center">Tổng</div>
                <div className="col-span-1 text-center">Xóa</div>
              </div>

              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 relative">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 flex gap-4">
                        <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 bg-gray-100">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.product?.name || "Sản phẩm"}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='gray'%3E%3Cpath d='M10 0a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-11h2v6H9V7zm1 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'/%3E%3C/svg%3E";
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
                              Không có ảnh
                            </div>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/products/${item.productId}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.product?.name || "Sản phẩm không xác định"}
                          </Link>
                          <div className="text-sm text-muted-foreground mt-1">
                            <div>Màu: {item.color || "Không có"}</div>
                            <div>Size: {item.size || "Không có"}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 p-0 text-muted-foreground hover:text-destructive sm:hidden mt-2"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                          </Button>
                        </div>
                      </div>

                      <div className="col-span-2 text-center">
                        <div className="sm:hidden text-sm text-muted-foreground mb-1">Giá:</div>
                        {formatPrice(item.product?.price || 0)}
                      </div>

                      <div className="col-span-2">
                        <div className="sm:hidden text-sm text-muted-foreground mb-1">Số lượng:</div>
                        <div className="flex items-center justify-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() =>
                              handleQuantityChange(item.id, (item.quantity - 1).toString())
                            }
                          >
                            <Minus className="h-3 w-3" />
                            <span className="sr-only">Giảm</span>
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() =>
                              handleQuantityChange(item.id, (item.quantity + 1).toString())
                            }
                          >
                            <Plus className="h-3 w-3" />
                            <span className="sr-only">Tăng</span>
                          </Button>
                        </div>
                      </div>

                      <div className="col-span-2 text-center font-medium">
                        <div className="sm:hidden text-sm text-muted-foreground mb-1">Tổng:</div>
                        {formatPrice((item.product?.price || 0) * item.quantity)}
                      </div>

                      <div className="col-span-1 text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hidden sm:flex mx-auto"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Xóa</span>
                        </Button>
                      </div>
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

              <div className="mt-6 text-sm text-muted-foreground">
                <p>Chọn phương thức thanh toán:</p>
                <div className="flex gap-2 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={() => setPaymentMethod("cash")}
                      className="hidden"
                    />
                    <div
                      className={`h-6 w-20 rounded cursor-pointer ${paymentMethod === "cash" ? "bg-primary text-primary-foreground" : "bg-muted"
                        } flex items-center justify-center`}
                    >
                      Tiền mặt
                    </div>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vnpay"
                      checked={paymentMethod === "vnpay"}
                      onChange={() => setPaymentMethod("vnpay")}
                      className="hidden"
                    />
                    <div
                      className={`h-6 w-20 rounded cursor-pointer ${paymentMethod === "vnpay" ? "bg-primary text-primary-foreground" : "bg-muted"
                        } flex items-center justify-center`}
                    >
                      VNPay
                    </div>
                  </label>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleCheckoutClick}
                disabled={orderLoading || !paymentMethod}
              >
                Xác nhận thanh toán
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-medium mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-muted-foreground mb-6">
            Có vẻ như bạn chưa thêm bất kỳ sản phẩm nào vào giỏ hàng.
          </p>
          <Button asChild>
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      )}

      <Dialog open={isCheckoutDialogOpen} onOpenChange={setIsCheckoutDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Xác nhận thông tin thanh toán</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Phương thức thanh toán</label>
              <p className="text-muted-foreground">
                {paymentMethod === "cash" ? "Tiền mặt" : paymentMethod === "vnpay" ? "VNPay" : "Chưa chọn"}
              </p>
            </div>
            <div>
              <label htmlFor="recipientName" className="block text-sm font-medium mb-1">
                Tên người nhận
              </label>
              <Input
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Nhập tên người nhận"
                required
              />
            </div>
            <div>
              <label htmlFor="province" className="block text-sm font-medium mb-1">
                Tỉnh/Thành phố
              </label>
              <Select onValueChange={setProvince} value={province}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p.code} value={p.code}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="district" className="block text-sm font-medium mb-1">
                Quận/Huyện
              </label>
              <Select onValueChange={setDistrict} value={district} disabled={!province}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d.code} value={d.code}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="ward" className="block text-sm font-medium mb-1">
                Xã/Phường
              </label>
              <Select onValueChange={setWard} value={ward} disabled={!district}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn xã/phường" />
                </SelectTrigger>
                <SelectContent>
                  {wards.map((w) => (
                    <SelectItem key={w.code} value={w.code}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="street" className="block text-sm font-medium mb-1">
                Thôn/Xóm (hoặc số nhà, đường)
              </label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Nhập thôn/xóm hoặc số nhà, đường"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Số điện thoại
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phương thức giao hàng
              </label>
              <Select onValueChange={(value) => console.log(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương thức giao hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Giao hàng nhanh</SelectItem>
                  <SelectItem value="economy">Giao hàng tiết kiệm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCheckoutDialogOpen(false)}
              disabled={orderLoading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmCheckout}
              disabled={orderLoading}
            >
              {orderLoading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}