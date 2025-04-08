// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { 
        id: params.id,
        userId // Đảm bảo chỉ user sở hữu order mới xem được
      },
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
        { error: 'Order not found or unauthorized' },
        { status: 404 }
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
  { params }: { params: { id: string } }
) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Kiểm tra order thuộc về user
    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
    });
    
    if (!existingOrder || existingOrder.userId !== userId) {
      return NextResponse.json(
        { error: 'Order not found or unauthorized' },
        { status: 404 }
      );
    }

    const { items } = await req.json();

    const order = await prisma.order.update({
      where: { id: params.id },
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
  try {
    const params = "then" in context.params ? await context.params : context.params;
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    // Kiểm tra đơn hàng tồn tại
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    // Kiểm tra trạng thái đơn hàng (chỉ hủy nếu đang PROCESSING)
    if (order.status !== "PROCESSING") {
      return NextResponse.json(
        { error: "Chỉ có thể hủy đơn hàng đang xử lý" },
        { status: 400 }
      );
    }

    // Cập nhật trạng thái đơn hàng thành CANCELLED thay vì xóa
    const cancelledOrder = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json(
      { message: "Hủy đơn hàng thành công", order: cancelledOrder },
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