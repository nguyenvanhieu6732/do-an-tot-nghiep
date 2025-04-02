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
import { Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/formatPrice";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
      const data = await response.json();
      console.log("Dữ liệu từ API:", data);
      setProducts(data.products); // Lấy mảng products từ data
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
      setProducts((prev) => [...prev, data]);
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
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-16 w-16 object-cover" />
                ) : (
                  <span>Không có ảnh</span>
                )}
              </td>
              <td className="py-2 px-4 border-b">{product.name}</td>
              <td className="py-2 px-4 border-b">{formatPrice(product.price)}</td>
              <td className="py-2 px-4 border-b">{product.stock}</td>
              <td className="py-2 px-4 border-b">{formatPrice(product.discountPrice) || 0}</td>
              <td className="py-2 px-4 border-b">
                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
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
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!isLoading && products.length === 0 && (
        <p className="text-center pt-8">Chưa có sản phẩm nào!</p>
      )}

      {/* Dialog thêm sản phẩm mới */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm(); // Reset form khi dialog đóng
        }}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium pb-2">
                Tên sản phẩm
              </label>
              <Input
                id="name"
                placeholder="Tên sản phẩm"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium pb-2">
                Giá
              </label>
              <Input
                id="price"
                placeholder="Giá"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium pb-2">
                Tồn kho
              </label>
              <Input
                id="stock"
                placeholder="Tồn kho"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium pb-2">
                Mô tả (tuỳ chọn)
              </label>
              <Input
                id="description"
                placeholder="Mô tả (tuỳ chọn)"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="discountPrice" className="block text-sm font-medium pb-2">
                Giảm giá (nếu có)
              </label>
              <Input
                id="discountPrice"
                placeholder="Giảm giá (nếu có)"
                type="number"
                value={newProduct.discountPrice}
                onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium pb-2">
                Hình ảnh
              </label>
              <InputFile
                onFileChange={(fileData) => setImageFile(fileData)}
                disabled={isLoading}
              />
            </div>
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

      {/* Dialog sửa sản phẩm */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) resetForm(); // Reset form khi dialog đóng
        }}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sửa sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium pb-2">
                Tên sản phẩm
              </label>
              <Input
                id="edit-name"
                placeholder="Tên sản phẩm"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="edit-price" className="block text-sm font-medium pb-2">
                Giá
              </label>
              <Input
                id="edit-price"
                placeholder="Giá"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="edit-stock" className="block text-sm font-medium pb-2">
                Tồn kho
              </label>
              <Input
                id="edit-stock"
                placeholder="Tồn kho"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium pb-2">
                Mô tả (tuỳ chọn)
              </label>
              <Input
                id="edit-description"
                placeholder="Mô tả (tuỳ chọn)"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="edit-discountPrice" className="block text-sm font-medium pb-2">
                Giảm giá (nếu có)
              </label>
              <Input
                id="edit-discountPrice"
                placeholder="Giảm giá (nếu có)"
                type="number"
                value={newProduct.discountPrice}
                onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="edit-image" className="block text-sm font-medium pb-2">
                Hình ảnh
              </label>
              <InputFile
                onFileChange={(fileData) => setImageFile(fileData)}
                disabled={isLoading}
              />
            </div>
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

      {/* Dialog xác nhận xóa */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) setProductToDelete(null); // Reset productToDelete khi đóng
        }}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto">
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