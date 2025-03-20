import { Webhook } from "svix";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const payload = req.body;
  const headers = req.headers;

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const event = wh.verify(payload, headers as Record<string, string>) as { type: string; data: { id: string; first_name: string; last_name: string; } };

    if (event.type === "user.created") {
      const { id, first_name, last_name } = event.data;

      await prisma.user.create({
        data: {
          clerkId: id,
          name: `${first_name || ""} ${last_name || ""}`,
        },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Webhook error" });
  }
}
