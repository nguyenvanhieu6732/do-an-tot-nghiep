import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

const createOrderSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  paymentMethod: z.string().min(1, "paymentMethod is required"),
  shippingMethod: z.string().min(1, "shippingMethod is required"),
  address: z.string().min(1, "address is required"),
  name: z.string().min(1, "name is required"),
  phone: z.string().min(1, "phone is required"),
});

const getOrderSchema = z.object({
  userId: z.string().min(1, "userId is required").nullable(),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const queryUserId = url.searchParams.get("userId");

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role.toUpperCase() !== "ADMIN") {
      if (!queryUserId || queryUserId !== userId) {
        return NextResponse.json(
          { error: "Forbidden: Only admins can view all orders" },
          { status: 403 }
        );
      }
    }

    const validatedQuery = getOrderSchema.safeParse({ userId: queryUserId });
    if (!validatedQuery.success) {
      return NextResponse.json(
        { error: validatedQuery.error.format() },
        { status: 400 }
      );
    }

    const whereClause = user.role.toUpperCase() === "ADMIN" && !queryUserId
      ? {}
      : validatedQuery.data.userId
      ? { userId: validatedQuery.data.userId }
      : {};

    const orders = await prisma.order.findMany({
      where: whereClause,
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
    const body = await req.json();
    const validatedData = createOrderSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        { error: validatedData.error.format() },
        { status: 400 }
      );
    }

    const { userId, name, paymentMethod, shippingMethod, address, phone } = validatedData.data;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

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