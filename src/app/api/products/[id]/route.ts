import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Định nghĩa schema cho product (giữ nguyên)
const productSchema = z.object({
  name: z.string().min(3).optional(),
  price: z.number().min(0).optional(),
  stock: z.number().int().min(0).optional(),
  description: z.string().optional(),
  image: z.string().optional(), // base64 string từ frontend
  discountPrice: z.number().min(0).optional(),
});

// Định nghĩa type cho params (giữ nguyên)
interface RouteParams {
  params: {
    id: string;
  };
}

// GET handler (đã sửa)
export async function GET(req: Request, { params }: RouteParams) {
  try {
    // Kiểm tra ID hợp lệ
    if (!params.id || typeof params.id !== "string") {
      return NextResponse.json(
        { error: "ID sản phẩm không hợp lệ" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    // Chuẩn hóa dữ liệu trả về
    const formattedProduct = {
      ...product,
      image: product.image
        ? `data:image/jpeg;base64,${Buffer.from(product.image).toString("base64")}`
        : null,
    };

    return NextResponse.json(formattedProduct, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}
// PUT handler (giữ nguyên)
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    let imageBuffer: Buffer | undefined;
    if (validatedData.image) {
      const base64Data = validatedData.image.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: validatedData.name,
        price: validatedData.price,
        stock: validatedData.stock,
        description: validatedData.description,
        image: imageBuffer,
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

// DELETE handler (giữ nguyên)
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
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