import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import axios from "axios";

const CLERK_API_URL = "https://api.clerk.com/v1/users";
const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY || "";

export async function GET() {
  try {
    if (!CLERK_SECRET_KEY) {
      console.error("CLERK_SECRET_KEY is missing");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    console.log("Fetching users from Clerk...");
    const response = await axios.get(CLERK_API_URL, {
      headers: { Authorization: `Bearer ${CLERK_SECRET_KEY}` },
    });

    if (response.status !== 200) throw new Error("Failed to fetch users from Clerk");

    const clerkUsers = Array.isArray(response.data) ? response.data : response.data.users || [];
    console.log("Number of Clerk Users:", clerkUsers.length);

    const clerkUserIds = clerkUsers.map((user: any) => user.id);

    // Lấy tất cả user từ database
    const dbUsers = await prisma.user.findMany();
    console.log("Fetched users from database:", dbUsers.length);

    const dbUserIds = dbUsers.map(user => user.id);

    // Tìm user bị xóa trên Clerk (có trong DB nhưng không có trong Clerk)
    const usersToDelete = dbUserIds.filter(id => !clerkUserIds.includes(id));

    if (usersToDelete.length > 0) {
      console.log("Deleting users:", usersToDelete);
      await prisma.user.deleteMany({ where: { id: { in: usersToDelete } } });
    }

    for (const clerkUser of clerkUsers) {
      const email = clerkUser.email_addresses?.[0]?.email_address || "";
      const firstName = clerkUser.first_name || "";
      const lastName = clerkUser.last_name || "";
      const imageUrl = clerkUser.image_url || "";

      if (!email) {
        console.warn(`Skipping user ${clerkUser.id} because email is missing.`);
        continue;
      }

      try {
        const existingUser = await prisma.user.findUnique({ where: { email } });

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
      } catch (dbError) {
        console.error("Error syncing user:", clerkUser.id, dbError);
      }
    }

    return NextResponse.json({ message: `User sync completed, deleted users: ${usersToDelete.length}` }, { status: 200 });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
