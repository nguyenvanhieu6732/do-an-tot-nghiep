import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  description: z.string().optional(),
  image: z.string().optional(), // Nhận base64 từ frontend
  discountPrice: z.number().min(0).optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);
    const resolvedParams = await params; // Await params để lấy id

    let imageBuffer: Buffer | undefined;
    if (validatedData.image) {
      // Chuyển base64 thành Buffer
      const base64Data = validatedData.image.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
    }

    const product = await prisma.product.update({
      where: { id: resolvedParams.id }, // Sử dụng id sau khi await
      data: {
        name: validatedData.name,
        price: validatedData.price,
        stock: validatedData.stock,
        description: validatedData.description,
        image: imageBuffer, // Cập nhật dữ liệu nhị phân nếu có
        discountPrice: validatedData.discountPrice,
      },
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params; // Await params để lấy id
    await prisma.product.delete({
      where: { id: resolvedParams.id }, // Sử dụng id sau khi await
    });
    return NextResponse.json({ message: "Xóa sản phẩm thành công" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 400 });
  }
}