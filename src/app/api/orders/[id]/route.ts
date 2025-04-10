import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Kiểm tra role của user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const params = "then" in context.params ? await context.params : context.params;
    const { id } = params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Nếu không phải admin, kiểm tra xem đơn hàng có thuộc về user không
    if (user.role !== "admin" && order.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only view your own orders' },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Kiểm tra role của user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const params = "then" in context.params ? await context.params : context.params;
    const { id } = params;

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Nếu không phải admin, kiểm tra xem đơn hàng có thuộc về user không
    if (user.role !== "admin" && existingOrder.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only update your own orders' },
        { status: 403 }
      );
    }

    const { items } = await req.json();

    const order = await prisma.order.update({
      where: { id },
      data: {
        items: {
          deleteMany: {},
          create: items.map((item: { productId: string; quantity: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Kiểm tra role của user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const params = "then" in context.params ? await context.params : context.params;
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Nếu không phải admin, kiểm tra xem đơn hàng có thuộc về user không
    if (user.role !== "admin" && order.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized: You can only cancel your own orders' },
        { status: 403 }
      );
    }

    // Kiểm tra trạng thái đơn hàng
    if (order.status !== "PROCESSING") {
      return NextResponse.json(
        { error: "Only orders in PROCESSING status can be canceled" },
        { status: 400 }
      );
    }

    const cancelledOrder = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(
      { message: "Order successfully canceled", order: cancelledOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Order Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}