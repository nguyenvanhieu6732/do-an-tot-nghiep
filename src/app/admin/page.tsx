"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Loading from "../(routes)/loading";
import { DashboardPage } from "./dashboard-page";

export default function AdminPage() {
    const { user, isLoaded } = useUser();
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded) {
            if (user?.publicMetadata?.role === "admin") {
                setIsAdmin(true);
            } else {
                router.replace("/not-found"); // Chuyển hướng nếu không phải admin
            }
        }
    }, [user, isLoaded, router]);

    if (!isLoaded) return <Loading />;

    return (
        isAdmin && (
            <DashboardPage />
        )
    );
}
