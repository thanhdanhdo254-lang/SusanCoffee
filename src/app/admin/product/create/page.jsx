"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductCreate() {
  const router = useRouter();

  // Khai báo State cho form
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Cà phê");
  const [status, setStatus] = useState("active");
  const [imageUrl, setImageUrl] = useState(""); // Dùng link ảnh để hiển thị nhanh
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  // Hàm xử lý gửi Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      name: productName,
      price: Number(price),
      category: category,
      status: status,
      image: imageUrl || "https://placehold.co/600x400?text=Susan+Coffee", // Ảnh mặc định nếu trống
    };

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const result = await res.json();

      if (res.ok || result.status === "success") {
        alert("Thêm sản phẩm mới thành công!");
        router.push("/admin/product");
        router.refresh();
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <div className="d-flex align-items-center mb-4">
                <Link href="/admin/product" className="btn btn-sm btn-outline-secondary me-3">
                   ←
                </Link>
                <h4 className="mb-0 fw-bold text-uppercase">Thêm sản phẩm mới</h4>
              </div>
              
              <hr />

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tên sản phẩm / Đồ uống</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Ví dụ: Bạc xỉu cốt dừa"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Giá bán (VNĐ)</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="25000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Phân loại</label>
                    <select 
                      className="form-select" 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Cà phê">Cà phê</option>
                      <option value="Trà trái cây">Trà trái cây</option>
                      <option value="Đá xay">Đá xay</option>
                      <option value="Bánh ngọt">Bánh ngọt</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Trạng thái mặc định</label>
                  <select 
                    className="form-select" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="active">Đang bán (Hiển thị lên POS)</option>
                    <option value="inactive">Tạm ngưng (Ẩn khỏi POS)</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Link ảnh sản phẩm (URL)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Dán link ảnh từ Pinterest hoặc Google vào đây..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <div className="form-text">Mẹo: Bạn có thể dùng ảnh từ Pinterest để giao diện Susan Coffee trông chuyên nghiệp hơn.</div>
                </div>

                {imageUrl && (
                  <div className="mb-4 text-center">
                    <p className="small text-muted">Xem trước ảnh:</p>
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="rounded shadow-sm" 
                      style={{ maxHeight: "150px", objectFit: "cover" }}
                      onError={(e) => e.target.src = "https://placehold.co/600x400?text=Link+anh+loi"}
                    />
                  </div>
                )}

                <div className="d-flex gap-2 pt-3">
                  <button 
                    type="submit" 
                    className="btn btn-dark btn-lg px-5 shadow-sm" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang lưu...
                      </>
                    ) : "Lưu sản phẩm"}
                  </button>
                  
                  <Link href="/admin/product" className="btn btn-light btn-lg px-4 text-muted">
                    Hủy bỏ
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}