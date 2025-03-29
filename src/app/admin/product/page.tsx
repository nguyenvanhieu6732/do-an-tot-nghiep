"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputFile from "@/components/products/InputFile";
import { Loader2 } from "lucide-react"; // Dùng icon loading từ lucide-react

export function ProductManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    image: "",
    discountPrice: "",
  });
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Thêm trạng thái loading

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      price: "",
      stock: "",
      description: "",
      image: "",
      discountPrice: "",
    });
    setImageFile(null);
    setErrorMessage("");
  };

  const handleEditProduct = (product: any) => {
    setCurrentProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || "",
      image: "",
      discountPrice: product.discountPrice?.toString() || "",
    });
    setImageFile(null);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);
    const updatedProduct: any = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock, 10),
      description: newProduct.description || undefined,
      discountPrice: parseFloat(newProduct.discountPrice) || undefined,
    };

    if (imageFile) {
      updatedProduct.image = imageFile;
    }

    try {
      const response = await fetch(`/api/products/${currentProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Cập nhật sản phẩm thất bại");
      setProducts((prev) =>
        prev.map((p) => (p.id === currentProduct.id ? { ...data, image: imageFile || p.image } : p))
      );
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error.message);
      } else {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
      }
      setErrorMessage(error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsLoading(true);
    const formattedProduct = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock, 10),
      description: newProduct.description || undefined,
      image: imageFile || undefined,
      discountPrice: parseFloat(newProduct.discountPrice) || undefined,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedProduct),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Thêm sản phẩm thất bại");
      setProducts((prev) => [...prev, { ...data, image: imageFile }]);
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Lỗi khi thêm sản phẩm:", error.message);
      } else {
        console.error("Lỗi khi thêm sản phẩm:", error);
      }
      setErrorMessage(error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAdd = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/${productToDelete}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("Xóa sản phẩm thất bại");
        setProducts((prev) => prev.filter((product) => product.id !== productToDelete));
        setIsDeleteDialogOpen(false);
        setProductToDelete(null);
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
        <Button variant="default" onClick={() => setIsDialogOpen(true)} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Thêm sản phẩm
        </Button>
      </div>
      {isLoading && (
        <div className="flex justify-center mb-4">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
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
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 object-cover"
                  />
                )}
              </td>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{product.price}</td>
              <td className="py-2 px-4 border-b">{product.stock}</td>
              <td className="py-2 px-4 border-b">{product.discountPrice || 0}</td>
              <td className="py-2 px-4 border-b">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                  disabled={isLoading}
                >
                  Sửa
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2"
                  onClick={() => {
                    setProductToDelete(product.id);
                    setIsDeleteDialogOpen(true);
                  }}
                  disabled={isLoading}
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
              disabled={isLoading}
            />
            <Input
              placeholder="Giá"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              disabled={isLoading}
            />
            <Input
              placeholder="Tồn kho"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              disabled={isLoading}
            />
            <Input
              placeholder="Mô tả (tuỳ chọn)"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              disabled={isLoading}
            />
            <Input
              placeholder="Giảm giá (nếu có)"
              type="number"
              value={newProduct.discountPrice}
              onChange={(e) =>
                setNewProduct({ ...newProduct, discountPrice: e.target.value })
              }
              disabled={isLoading}
            />
            <InputFile onFileChange={(fileData) => setImageFile(fileData)} disabled={isLoading} />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelAdd} disabled={isLoading}>
              Hủy
            </Button>
            <Button variant="default" onClick={handleAddProduct} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              disabled={isLoading}
            />
            <Input
              placeholder="Giá"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              disabled={isLoading}
            />
            <Input
              placeholder="Tồn kho"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              disabled={isLoading}
            />
            <Input
              placeholder="Mô tả (tuỳ chọn)"
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              disabled={isLoading}
            />
            <Input
              placeholder="Giảm giá (nếu có)"
              type="number"
              value={newProduct.discountPrice}
              onChange={(e) =>
                setNewProduct({ ...newProduct, discountPrice: e.target.value })
              }
              disabled={isLoading}
            />
            <InputFile onFileChange={(fileData) => setImageFile(fileData)} disabled={isLoading} />

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
              Hủy
            </Button>
            <Button variant="default" onClick={handleUpdateProduct} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa sản phẩm</DialogTitle>
          </DialogHeader>
          <p>Bạn có chắc chắn muốn xóa sản phẩm này không?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isLoading}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}