import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(3, { message: "Tên sản phẩm phải có ít nhất 3 ký tự" }),
  price: z.number().min(0, { message: "Giá phải lớn hơn hoặc bằng 0" }),
  stock: z.number().int().min(0, { message: "Tồn kho phải là số nguyên không âm" }),
  description: z.string().optional(),
  image: z.string().optional(), // Nhận base64 từ frontend
  discountPrice: z.number().min(0, { message: "Giảm giá phải lớn hơn hoặc bằng 0" }).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    let imageBuffer: Buffer | undefined;
    if (validatedData.image) {
      // Chuyển base64 thành Buffer
      const base64Data = validatedData.image.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
    }

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        price: validatedData.price,
        stock: validatedData.stock,
        description: validatedData.description,
        image: imageBuffer, // Lưu dữ liệu nhị phân trực tiếp
        discountPrice: validatedData.discountPrice,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany();
    // Chuyển dữ liệu nhị phân thành base64 để gửi về frontend
    const formattedProducts = products.map((product) => ({
      ...product,
      image: product.image ? `data:image/jpeg;base64,${product.image.toString()}` : null,
    }));
    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 400 });
  }
}