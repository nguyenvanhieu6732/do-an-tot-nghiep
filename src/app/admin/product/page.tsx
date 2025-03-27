"use client"

import { useState, useEffect } from "react"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import InputFile from "@/components/products/uploadFile"

export function ProductManagement() {
    const [products, setProducts] = useState<any[]>([])
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<string | null>(null)
    const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", imageUrl: "" })

    useEffect(() => {
        fetch("/api/products")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error fetching products:", error))
    }, [])

    const handleEditProduct = (productId: string) => {
        console.log("Edit product", productId)
    }

    const handleAddProduct = () => {
        fetch("/api/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newProduct),
        })
        .then((response) => response.json())
        .then((data) => {
            setProducts((prevProducts) => [...prevProducts, data])
            setIsDialogOpen(false)
            setNewProduct({ name: "", price: "", stock: "", imageUrl: "" })
        })
        .catch((error) => console.error("Error adding product:", error))
    }

    const handleDeleteProduct = () => {
        if (productToDelete) {
            fetch(`/api/products/${productToDelete}`, {
                method: "DELETE",
            })
            .then(() => {
                setProducts((prevProducts) => prevProducts.filter(product => product.id !== productToDelete))
                setIsDeleteDialogOpen(false)
                setProductToDelete(null)
            })
            .catch((error) => console.error("Error deleting product:", error))
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
                <Button variant="default" onClick={() => setIsDialogOpen(true)}>
                    Thêm sản phẩm
                </Button>
            </div>
            <table className="min-w-full bg-muted">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b text-left">Hình ảnh</th>
                        <th className="py-2 px-4 border-b text-left">Tên sản phẩm</th>
                        <th className="py-2 px-4 border-b text-left">Giá</th>
                        <th className="py-2 px-4 border-b text-left">Tồn kho</th>
                        <th className="py-2 px-4 border-b text-left">Giảm giá</th>
                        <th className="py-2 px-4 border-b text-left">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td className="py-2 px-4 border-b">
                                <img src={product.imageUrl} alt={product.name} className="h-16 w-16 object-cover" />
                            </td>
                            <td className="py-2 px-4 border-b">{product.name}</td>
                            <td className="py-2 px-4 border-b">{product.price}</td>
                            <td className="py-2 px-4 border-b">{product.stock}</td>
                            <td className="py-2 px-4 border-b">{product.discountPrice}</td>
                            <td className="py-2 px-4 border-b">
                                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product.id)}>
                                    Sửa
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="ml-2" 
                                    onClick={() => {
                                        setProductToDelete(product.id)
                                        setIsDeleteDialogOpen(true)
                                    }}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Add Product Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Tên sản phẩm"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <Input
                            placeholder="Giá"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                        <Input
                            placeholder="Tồn kho"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        />
                        <InputFile />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="default" onClick={handleAddProduct}>
                            Thêm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Product Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                    </DialogHeader>
                    <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteProduct}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
