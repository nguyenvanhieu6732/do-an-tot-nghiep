import Link from "next/link";
import CartClient from "./CartClient"; // Import Client Component

export const metadata = {
  title: "Giỏ hàng - LUXMEN",
  description: "Giỏ hàng của bạn tại LUXMEN",
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>
      <CartClient />
    </div>
  );
}