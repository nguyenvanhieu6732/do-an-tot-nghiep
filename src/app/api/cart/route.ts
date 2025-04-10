import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Thêm sản phẩm vào giỏ hàng
export async function POST(req: NextRequest) {
  try {
    const { userId, productId, quantity, color, size } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        color,
        size,
      },
    });

    let cartItem;
    if (existingCartItem) {
      // Nếu đã có, cộng dồn quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
    } else {
      // Nếu chưa có, tạo mới
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
          color,
          size,
        },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Lấy giỏ hàng của user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }, 
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
