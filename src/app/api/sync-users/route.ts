import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import axios from "axios";

const CLERK_API_URL = "https://api.clerk.com/v1/users";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "";

export async function GET() {
  try {
    // Gọi API Clerk để lấy danh sách user
    const response = await axios.get(CLERK_API_URL, {
      headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
    });

    if (response.status !== 200) throw new Error("Failed to fetch users from Clerk");

    const clerkUsers = response.data; // Danh sách user từ Clerk
    const clerkUserIds = clerkUsers.map((user: any) => user.id); // Lấy danh sách ID

    // Lấy tất cả user từ database
    const dbUsers = await prisma.user.findMany();
    const dbUserIds = dbUsers.map(user => user.id);

    // Tìm user bị xóa trên Clerk (có trong DB nhưng không có trong Clerk)
    const usersToDelete = dbUserIds.filter(id => !clerkUserIds.includes(id));

    // Xóa user bị xóa trên Clerk khỏi database
    if (usersToDelete.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: usersToDelete } },
      });
    }

    // Đồng bộ user (giống code cũ của bạn)
    for (const clerkUser of clerkUsers) {
      const email = clerkUser.email_addresses[0]?.email_address || "";
      const firstName = clerkUser.first_name || "";
      const lastName = clerkUser.last_name || "";
      const imageUrl = clerkUser.image_url || "";

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        await prisma.user.update({
          where: { email },
          data: { firstName, lastName, imageUrl },
        });
      } else {
        await prisma.user.create({
          data: {
            id: clerkUser.id,
            email,
            firstName,
            lastName,
            imageUrl,
            role: "user",
          },
        });
      }
    }

    return NextResponse.json({ message: "User sync completed, deleted users: " + usersToDelete.length }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
