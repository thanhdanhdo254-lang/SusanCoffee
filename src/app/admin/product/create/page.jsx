"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductCreate() {
  const router = useRouter();

  // Khai báo State cho form
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [loading, setLoading] = useState(false);

  // Hàm xử lý gửi Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      name: productName,
      price: price,
      status: status,
    };

    try {
      const res = await fetch("http://localhost:3000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const result = await res.json();

      if (res.ok || result.status === "success") {
        alert("Thêm sản phẩm thành công!");
        router.push("/admin/product"); // Chuyển về trang danh sách sau khi thêm
        router.refresh(); // Làm mới dữ liệu
      } else {
        alert("Lỗi: " + (result.message || "Không thể thêm sản phẩm"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <div className="card shadow border-0">
        <div className="card-body p-4">
          <h4 className="card-title mb-4 fw-bold">Thêm sản phẩm mới</h4>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Tên sản phẩm</label>
              <input
                type="text"
                className="form-control"
                placeholder="Ví dụ: Cà phê Muối"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Giá (VNĐ)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="35000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Trạng thái</label>
                <select 
                  className="form-select" 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">Đang bán</option>
                  <option value="inactive">Ngừng bán</option>
                </select>
              </div>
            </div>

            {/* Phần chọn ảnh (Giao diện tĩnh) */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Ảnh sản phẩm</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
              />
              <div className="form-text">Lưu ý: Chức năng upload ảnh cần cài đặt thêm Multer ở Backend.</div>
            </div>

            <div className="d-flex gap-2">
              <button 
                type="submit" 
                className="btn btn-dark px-4" 
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu sản phẩm"}
              </button>
              
              <Link href="/admin/product" className="btn btn-outline-secondary px-4">
                Hủy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}