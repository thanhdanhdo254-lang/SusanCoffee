"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdateProduct() {
  const params = useParams(); // Lấy ID từ thanh địa chỉ
  const router = useRouter();
  const id = params.id;

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");

  // 1. Lấy dữ liệu cũ của sản phẩm khi vào trang
  useEffect(() => {
    async function getProductDetail() {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProductName(data.name);
          setPrice(data.price);
          setStatus(data.status);
        }
      } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
      }
    }
    if (id) getProductDetail();
  }, [id]);

  // 2. Xử lý gửi dữ liệu cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = { name: productName, price, status };

    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        alert("Cập nhật thành công!");
        router.refresh(); // QUAN TRỌNG: Để xóa cache trang danh sách
        router.push("/admin/product");
      } else {
        // Thêm dòng này để biết lỗi cụ thể từ server trả về là gì
        const errorData = await res.json();
        alert("Cập nhật thất bại: " + (errorData.error || "Lỗi không xác định"));
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <div className="content">
      <div className="card shadow">
        <div className="card-body">
          <h4 className="card-title mb-4">Sửa sản phẩm</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="productName" className="form-label">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="row row-cols-2">
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Giá (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">Trạng thái</label>
                <select 
                  className="form-select" 
                  id="status" 
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                >
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Ảnh sản phẩm</label>
              <input
                type="file"
                className="form-control"
                id="image"
                accept="image/*"
              />
            </div>
            <div className="mt-4">
              <button type="submit" className="btn btn-dark me-2">Lưu thay đổi</button>
              {/* Nút hủy quay về danh sách */}
              <Link href="/admin/product" className="btn btn-outline-secondary">
                Hủy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}