import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Đảm bảo bạn đã cấu hình Prisma

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });

        const user = await prisma.user.findUnique({
            where: { email },
            select: { role: true },
        });

        return NextResponse.json({ isAdmin: user?.role === "admin" });
    } catch (error) {
        return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
    }
}
