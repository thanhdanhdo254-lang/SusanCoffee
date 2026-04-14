"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function UpdateProduct() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("active");
  const [category, setCategory] = useState("");
  const [currentImage, setCurrentImage] = useState(""); // Lưu URL ảnh cũ
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  // 1. Lấy dữ liệu cũ của sản phẩm
  useEffect(() => {
    async function getProductDetail() {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProductName(data.name);
          setPrice(data.price);
          setStatus(data.status);
          setCategory(data.category || "");
          setCurrentImage(data.image || "");
        }
      } catch (error) {
        console.error("Lỗi fetch dữ liệu:", error);
      }
    }
    if (id) getProductDetail();
  }, [id, API_URL]);

  // 2. Xử lý cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedProduct = { 
      name: productName, 
      price: Number(price), 
      status,
      category,
      image: currentImage // Tạm thời giữ ảnh cũ, nếu bạn làm upload ảnh thật thì xử lý thêm ở đây
    };

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        alert("Cập nhật sản phẩm thành công!");
        router.push("/admin/product");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert("Thất bại: " + (errorData.message || "Lỗi server"));
      }
    } catch (error) {
      alert("Không thể kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h4 className="card-title mb-4 fw-bold text-uppercase text-primary">
                Sửa thông tin sản phẩm
              </h4>
              <hr />
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Ví dụ: Cà phê Muối"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Giá bán (VNĐ)</label>
                    <input
                      type="number"
                      className="form-control"
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
                      <option value="">Chọn loại...</option>
                      <option value="Cà phê">Cà phê</option>
                      <option value="Trà trái cây">Trà trái cây</option>
                      <option value="Đá xay">Đá xay</option>
                      <option value="Bánh ngọt">Bánh ngọt</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Trạng thái kinh doanh</label>
                  <div className="d-flex gap-3">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="status" 
                        id="active" 
                        value="active"
                        checked={status === "active"}
                        onChange={(e) => setStatus(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="active">Đang bán</label>
                    </div>
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="radio" 
                        name="status" 
                        id="inactive" 
                        value="inactive"
                        checked={status === "inactive"}
                        onChange={(e) => setStatus(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="inactive">Ngừng bán</label>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Hình ảnh hiện tại</label>
                  <div className="mb-2">
                    {currentImage ? (
                      <img src={currentImage} alt="Preview" className="rounded shadow-sm" style={{width: '120px', height: '120px', objectFit: 'cover'}} />
                    ) : (
                      <div className="text-muted small italic">Chưa có ảnh</div>
                    )}
                  </div>
                  <input type="file" className="form-control form-control-sm" accept="image/*" />
                  <small className="text-muted mt-1 d-block">Chọn file mới nếu muốn thay đổi ảnh.</small>
                </div>

                <div className="d-flex gap-2 pt-2">
                  <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                  <Link href="/admin/product" className="btn btn-light px-4">
                    Quay lại
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