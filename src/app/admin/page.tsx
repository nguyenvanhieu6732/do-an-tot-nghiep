"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loading from "../(routes)/loading";
import { DashboardPage } from "./dashboard-page";

export default function AdminPage() {
    const { user, isLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const [checking, setChecking] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            if (!user?.emailAddresses[0]?.emailAddress) {
                setChecking(false);
                router.replace("/not-found");
                return;
            }

            try {
                const res = await fetch("/api/check-admin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user.emailAddresses[0].emailAddress }),
                });

                const data = await res.json();
                if (data.isAdmin) {
                    setIsAdmin(true);
                } else {
                    router.replace("/not-found");
                }
            } catch (error) {
                console.error("Lỗi kiểm tra quyền admin:", error);
                router.replace("/not-found");
            } finally {
                setChecking(false);
            }
        };

        if (isLoaded) checkAdmin();
    }, [user, isLoaded, router]);

    if (!isLoaded || checking) return <Loading />;

    return isAdmin ? <DashboardPage /> : null;
}
