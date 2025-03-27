"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputFile from "@/components/products/uploadFile";

export function ProductManagement() {
    const [products, setProducts] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [currentProduct, setCurrentProduct] = useState<any>(null);
    const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "", imageUrl: "", discountPrice: "" });
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        fetch("/api/products")
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error("Error fetching products:", error));
    }, []);

    const resetForm = () => {
        setNewProduct({ name: "", price: "", stock: "", imageUrl: "", discountPrice: "" });
        setErrorMessage("");
    };

    const handleEditProduct = (product: any) => {
        setCurrentProduct(product);
        setNewProduct({
            name: product.name,
            price: product.price.toString(),
            stock: product.stock.toString(),
            imageUrl: product.imageUrl,
            discountPrice: product.discountPrice.toString(),
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdateProduct = () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const updatedProduct = {
            ...newProduct,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock, 10),
            discountPrice: parseFloat(newProduct.discountPrice) || 0,
        };

        fetch(`/api/products/${currentProduct.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedProduct),
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Cập nhật sản phẩm thất bại");
                setProducts((prev) => prev.map((p) => (p.id === currentProduct.id ? data : p)));
                setIsEditDialogOpen(false);
                resetForm(); // Reset form sau khi cập nhật thành công
            })
            .catch((error) => {
                console.error("Lỗi khi cập nhật sản phẩm:", error.message);
                setErrorMessage(error.message);
            });
    };

    const handleCancelEdit = () => {
        setIsEditDialogOpen(false);
        resetForm(); // Reset form khi hủy
    };

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price || !newProduct.stock) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const formattedProduct = {
            ...newProduct,
            price: parseFloat(newProduct.price),
            stock: parseInt(newProduct.stock, 10),
            discountPrice: parseFloat(newProduct.discountPrice) || 0,
        };

        fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formattedProduct),
        })
            .then(async (response) => {
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Thêm sản phẩm thất bại");
                setProducts((prev) => [...prev, data]);
                setIsDialogOpen(false);
                resetForm(); // Reset form sau khi thêm thành công
            })
            .catch((error) => {
                console.error("Lỗi khi thêm sản phẩm:", error.message);
                setErrorMessage(error.message);
            });
    };

    const handleCancelAdd = () => {
        setIsDialogOpen(false);
        resetForm(); // Reset form khi hủy
    };

    const handleDeleteProduct = () => {
        if (productToDelete) {
            fetch(`/api/products/${productToDelete}`, { method: "DELETE" })
                .then(() => {
                    setProducts((prev) => prev.filter((product) => product.id !== productToDelete));
                    setIsDeleteDialogOpen(false);
                    setProductToDelete(null);
                })
                .catch((error) => console.error("Error deleting product:", error));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
                <Button variant="default" onClick={() => setIsDialogOpen(true)}>Thêm sản phẩm</Button>
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
                                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>Sửa</Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => {
                                        setProductToDelete(product.id);
                                        setIsDeleteDialogOpen(true);
                                    }}
                                >
                                    Xóa
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Dialog Thêm Sản Phẩm */}
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
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                        <Input
                            placeholder="Tồn kho"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        />
                        <Input
                            placeholder="URL hình ảnh"
                            value={newProduct.imageUrl}
                            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        />
                        <Input
                            placeholder="Giảm giá (nếu có)"
                            type="number"
                            value={newProduct.discountPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                        />
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancelAdd}>Hủy</Button>
                        <Button variant="default" onClick={handleAddProduct}>Thêm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Sửa Sản Phẩm */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sửa sản phẩm</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Tên sản phẩm"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        />
                        <Input
                            placeholder="Giá"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        />
                        <Input
                            placeholder="Tồn kho"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        />
                        <Input
                            placeholder="URL hình ảnh"
                            value={newProduct.imageUrl}
                            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        />
                        <Input
                            placeholder="Giảm giá"
                            type="number"
                            value={newProduct.discountPrice}
                            onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                        />
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleCancelEdit}>Hủy</Button>
                        <Button variant="default" onClick={handleUpdateProduct}>Lưu</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog Xóa Sản Phẩm */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
                    </DialogHeader>
                    <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Hủy</Button>
                        <Button variant="destructive" onClick={handleDeleteProduct}>Xóa</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}