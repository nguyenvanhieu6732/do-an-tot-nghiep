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

// API POST giữ nguyên
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    let imageBuffer: Buffer | undefined;
    if (validatedData.image) {
      const base64Data = validatedData.image.replace(/^data:image\/\w+;base64,/, "");
      imageBuffer = Buffer.from(base64Data, "base64");
    }

    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        price: validatedData.price,
        stock: validatedData.stock,
        description: validatedData.description,
        image: imageBuffer,
        discountPrice: validatedData.discountPrice,
      },
    });

    const productWithImage = {
      ...product,
      image: imageBuffer ? `data:image/jpeg;base64,${imageBuffer.toString("base64")}` : null,
    };

    return NextResponse.json(productWithImage, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}

// API GET với phân trang và tùy chọn lấy tất cả sản phẩm
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page");
    const sort = searchParams.get("sort");

    // Nếu không có page, lấy tất cả sản phẩm
    if (!page) {
      let orderBy: any = undefined;
      if (sort) {
        switch (sort) {
          case "newest":
            orderBy = { createdAt: "desc" };
            break;
          case "price-desc":
            orderBy = { price: "desc" };
            break;
          case "price-asc":
            orderBy = { price: "asc" };
            break;
          default:
            orderBy = undefined;
        }
      }

      const products = await prisma.product.findMany({
        orderBy, // Nếu không có sort, lấy theo thứ tự mặc định của DB
      });

      const formattedProducts = products.map((product) => ({
        ...product,
        image: product.image ? `data:image/jpeg;base64,${Buffer.from(product.image).toString("base64")}` : null,
      }));

      return NextResponse.json(
        {
          products: formattedProducts,
          totalProducts: formattedProducts.length,
        },
        { status: 200 }
      );
    }

    // Logic phân trang (khi có page)
    const pageNum = parseInt(page || "1", 10);
    const pageSize = 6;
    const skip = (pageNum - 1) * pageSize;

    let orderBy: any = undefined;
    if (sort) {
      switch (sort) {
        case "newest":
          orderBy = { createdAt: "desc" };
          break;
        case "price-desc":
          orderBy = { price: "desc" };
          break;
        case "price-asc":
          orderBy = { price: "asc" };
          break;
        default:
          orderBy = undefined;
      }
    }

    const totalProducts = await prisma.product.count();
    const totalPages = Math.ceil(totalProducts / pageSize);

    const products = await prisma.product.findMany({
      skip,
      take: pageSize,
      orderBy,
    });

    const formattedProducts = products.map((product) => ({
      ...product,
      image: product.image ? `data:image/jpeg;base64,${Buffer.from(product.image).toString("base64")}` : null,
    }));

    return NextResponse.json(
      {
        products: formattedProducts,
        pagination: {
          currentPage: pageNum,
          pageSize,
          totalProducts,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Lỗi không xác định" }, { status: 500 });
  }
}