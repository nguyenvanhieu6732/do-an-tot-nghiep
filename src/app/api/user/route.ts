import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Lấy danh sách user (GET)
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// Tạo user mới (POST)
export async function POST(req: Request) {
  const { name, email } = await req.json();
  if (!name || !email) {
    return NextResponse.json({ error: "Thiếu thông tin!" }, { status: 400 });
  }

  try {
    const newUser = await prisma.user.create({
      data: { name, email },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi khi tạo user!" }, { status: 500 });
  }
}
