"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Product() {
  const [products, setProducts] = useState([]);

  // 1. Hàm lấy danh sách sản phẩm từ backend
  async function fetchProducts() {
    try {
      const res = await fetch("http://localhost:3000/api/products");
      const data = await res.json();
      // Giả sử API trả về một mảng sản phẩm trực tiếp
      setProducts(data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Hàm xử lý xóa sản phẩm
  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      try {
        const res = await fetch(`http://localhost:3000/api/products/${id}`, {
          method: "DELETE",
        });
        const result = await res.json();

        if (res.ok || result.status === "success") {
          alert("Xóa sản phẩm thành công!");
          fetchProducts(); // Tải lại danh sách sau khi xóa
        } else {
          alert("Xóa thất bại: " + (result.message || "Lỗi server"));
        }
      } catch (error) {
        alert("Không thể kết nối đến server");
      }
    }
  };

  return (
    <div className="content">
      <div className="card shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="card-title">Danh sách sản phẩm</h4>
            {/* Chuyển hướng sang trang thêm mới */}
            <Link className="btn btn-outline-dark" href="/admin/product/create">
              + Thêm sản phẩm
            </Link>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id}>
                      {/* Hiển thị 8 ký tự cuối của ID cho gọn */}
                      <td>{product._id.slice(-8)}</td>
                      <td>{product.name}</td>
                      <td>{Number(product.price).toLocaleString()}đ</td>
                      <td>
                        {product.status === "active" ? (
                          <span className="badge bg-success">Đang bán</span>
                        ) : (
                          <span className="badge bg-secondary">Ngừng bán</span>
                        )}
                      </td>
                      <td>
                        {/* Link đến trang sửa theo ID */}
                        <Link
                          href={`/admin/product/update/${product._id}`}
                          className="btn btn-warning btn-sm me-2"
                        >
                          Sửa
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(product._id)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Không có sản phẩm nào hoặc đang tải...
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