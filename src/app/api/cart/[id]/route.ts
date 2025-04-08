import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Cập nhật số lượng CartItem
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = "then" in context.params ? await context.params : context.params;
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
    }

    const { quantity } = await req.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    return NextResponse.json(cartItem, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Xóa CartItem
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

    await prisma.cartItem.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}