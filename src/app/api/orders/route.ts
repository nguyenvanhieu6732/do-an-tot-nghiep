import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const prisma = new PrismaClient();

// Schema validation cho POST request
const createOrderSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  paymentMethod: z.string().min(1, "paymentMethod is required"),
  shippingMethod: z.string().min(1, "shippingMethod is required"),
  address: z.string().min(1, "address is required"),
  name: z.string().min(1, "name is required"),
  phone: z.string().min(1, "phone is required"),
});

// Schema validation cho GET request
const getOrderSchema = z.object({
  userId: z.string().min(1, "userId is required"),
});

export async function GET(req: NextRequest) {
  try {
    // Lấy và validate userId từ query parameter
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    const validatedQuery = getOrderSchema.safeParse({ userId });
    if (!validatedQuery.success) {
      return NextResponse.json(
        { error: validatedQuery.error.format() },
        { status: 400 }
      );
    }

    // Lấy danh sách đơn hàng của user
    const orders = await prisma.order.findMany({
      where: { userId: validatedQuery.data.userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format dữ liệu trả về
    const formattedOrders = orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          image: item.product.image
            ? `data:image/jpeg;base64,${Buffer.from(item.product.image).toString("base64")}`
            : null,
        },
      })),
    }));

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (error) {
    console.error("GET Orders Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse và validate request body
    const body = await req.json();
    const validatedData = createOrderSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.format() },
        { status: 400 }
      );
    }

    const { userId, name, paymentMethod, shippingMethod, address, phone } = validatedData.data;

    // Lấy tất cả CartItem của user
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Tính tổng giá tiền
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // Tạo Order mới từ CartItem
    const order = await prisma.order.create({
      data: {
        userId,
        status: "PROCESSING",
        paymentMethod,
        shippingMethod,
        name,
        address,
        phone,
        totalPrice,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Xóa CartItem sau khi tạo Order
    await prisma.cartItem.deleteMany({
      where: { userId },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("POST Orders Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}