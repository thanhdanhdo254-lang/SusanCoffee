"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tự động lấy URL API linh hoạt (Local hoặc Vercel)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  // 1. Hàm tải danh sách sản phẩm
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Hàm xóa sản phẩm
  const handleDelete = async (id) => {
    if (!confirm("Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?")) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok || result.status === "success") {
        alert("Đã xóa sản phẩm thành công!");
        fetchProducts(); // Tải lại danh sách
      } else {
        alert("Xóa thất bại: " + (result.message || "Lỗi hệ thống"));
      }
    } catch (error) {
      alert("Lỗi kết nối server!");
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="card shadow border-0">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-uppercase">Quản lý kho hàng</h5>
          <Link className="btn btn-dark btn-sm px-3" href="/admin/product/create">
            <i className="bi bi-plus-lg"></i> + Thêm sản phẩm mới
          </Link>
        </div>
        
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "80px" }}>Ảnh</th>
                  <th>Tên món / Đồ uống</th>
                  <th>Phân loại</th>
                  <th>Giá bán</th>
                  <th>Trạng thái</th>
                  <th className="text-end">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <div className="spinner-border spinner-border-sm text-secondary me-2"></div>
                      Đang tải dữ liệu sản phẩm...
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img 
                          // Nếu là link web (http) thì dùng luôn, nếu là tên file thì lấy từ thư mục /images/
                          src={product.image?.startsWith('http') ? product.image : `/images/${product.image}`} 
                          alt={product.name}
                          className="rounded"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          // Hiện ảnh mặc định nếu đường dẫn bị hỏng
                          onError={(e) => { e.target.src = "/no-image.png"; }} 
                        />
                      </td>
                      <td>
                        <div className="fw-bold">{product.name}</div>
                        <small className="text-muted">ID: {product._id.slice(-6)}</small>
                      </td>
                      <td>
                        <span className="badge border text-dark fw-normal bg-light">
                          {product.category || "Chưa phân loại"}
                        </span>
                      </td>
                      <td className="fw-bold text-danger">
                        {Number(product.price).toLocaleString()}đ
                      </td>
                      <td>
                          {product.status === "active" ? (
                            <span className="badge bg-success-subtle text-success px-3 border border-success">
                              Đang bán
                            </span>
                          ) : (
                            <span className="badge bg-danger-subtle text-danger px-3 border border-danger">
                              Ngừng bán
                            </span>
                          )}
                        </td>
                      <td className="text-end">
                        <div className="btn-group">
                          <Link
                            href={`/admin/product/update/${product._id}`}
                            className="btn btn-outline-warning btn-sm"
                          >
                            Sửa
                          </Link>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(product._id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      Kho hàng trống. Vui lòng thêm sản phẩm đầu tiên!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}