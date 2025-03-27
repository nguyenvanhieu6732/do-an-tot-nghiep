"use client"

import { useState, useEffect } from "react"
import { Package, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import InputFile from "@/components/products/uploadFile"
import { ProductManagement } from "./product/page"

export function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
    const [products, setProducts] = useState<any[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", imageUrl: "" })
    const isDesktop = useMediaQuery("(min-width: 1024px)")

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const handleMenuClick = (menu: string) => {
        setSelectedMenu(menu)
    }


    return (
        <div className="flex h-screen bg-muted">
            {/* Sidebar */}
            <div
                className={`${sidebarOpen || isDesktop ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 w-64 bg-background shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen z-40`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b bg-background">
                        <h1 className="text-xl font-bold bg-background">Trang Admin</h1>
                        {!isDesktop && (
                            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                                <X className="h-5 w-5 bg-muted" />
                            </Button>
                        )}
                    </div>
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 bg-background hover:bg-muted"
                            onClick={() => handleMenuClick("products")}
                        >
                            <Package className="h-5 w-5" />
                            Sản phẩm
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 bg-background hover:bg-muted"
                            onClick={() => handleMenuClick("orders")}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Đơn hàng
                        </Button>

                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4">
                {selectedMenu === "products" && (
                    <ProductManagement />
                )}
                {selectedMenu === "orders" && (
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Danh sách đơn hàng</h2>
                        {/* Render your orders here */}
                    </div>
                )}
            </div>

            {/* Add Product Dialog */}

        </div>
    )
}
