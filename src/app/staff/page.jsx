"use client";
import AddToCart from "@/components/AddToCart";
import StaffOrder from "@/components/StaffOrder";
import { useEffect, useState } from "react";

export default function Pos() {
  const [productList, setProductList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8; // Tăng lên 8 để hiển thị đẹp hơn trên màn hình POS

  // FILTER - Tìm kiếm sản phẩm
  const filteredProductList = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword.toLowerCase()) ||
      p._id.toLowerCase().includes(keyword.toLowerCase())
  );

  // PAGINATION - Phân trang
  const totalPages = Math.ceil(filteredProductList.length / itemsPerPage);
  const currentItems = filteredProductList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // FETCH API - Lấy dữ liệu từ Database
  useEffect(() => {
    const fetchProductList = async () => {
      try {
        // SỬA TẠI ĐÂY: Sử dụng biến môi trường thay cho localhost
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const res = await fetch(`${apiUrl}/api/products`);
        
        if (!res.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
        
        const data = await res.json();
        setProductList(data);
      } catch (err) {
        console.error("Lỗi POS Fetch:", err);
      }
    };
    fetchProductList();
  }, []);

  return (
    <main className="container-fluid mt-5 pt-4">
      <div className="row">

        {/* CỘT TRÁI: CHỌN MÓN */}
        <div className="col-sm-6 col-md-8">
          <div className="d-flex mb-3 justify-content-between align-items-center">
            <h3 className="mb-0 fw-bold">Chọn món</h3>
            <form className="w-50" onSubmit={(e) => e.preventDefault()}>
              <input
                type="search"
                className="form-control shadow-sm"
                placeholder="Tìm món theo tên hoặc ID..."
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                }}
              />
            </form>
          </div>

          {/* HIỂN THỊ DANH SÁCH SẢN PHẨM */}
          <div className="row">
            {currentItems.length > 0 ? (
              currentItems.map((p) => (
                <div key={p._id} className="col-6 col-md-4 col-lg-3 mb-3">
                  <div className="card h-100 shadow-sm border-0 product-card">
                    {/* Kiểm tra ảnh, nếu không có dùng ảnh mặc định */}
                    <img 
                      src={p.image ? `/img/${p.image}` : "/img/default-coffee.jpg"} 
                      className="card-img-top p-2" 
                      style={{ height: "150px", objectFit: "cover", borderRadius: "15px" }}
                      alt={p.name}
                    />
                    <div className="card-body text-center pt-0">
                      <h6 className="card-title text-truncate">{p.name}</h6>
                      <p className="text-danger fw-bold">{p.price.toLocaleString("vi-VN")}đ</p>
                      <AddToCart product={p}>
                        <i className="bi bi-plus-circle me-1"></i> Thêm
                      </AddToCart>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center mt-5">
                <p className="text-muted">Không tìm thấy món nào khớp với "{keyword}"</p>
              </div>
            )}
          </div>

          {/* PHÂN TRANG */}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>Trước</button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>Sau</button>
                </li>
              </ul>
            </nav>
          )}
        </div>

        {/* CỘT PHẢI: HÓA ĐƠN & KHÁCH HÀNG */}
        <div className="col-sm-6 col-md-4 border-start bg-light py-3 min-vh-100">
          <h3 className="fw-bold mb-3">Khách hàng</h3>
          <div className="btn-group w-100 mb-3 shadow-sm">
            <button className="btn btn-dark">Khách lẻ</button>
            <button className="btn btn-outline-dark">Thành viên</button>
          </div>

          <div className="mb-4">
            <input type="text" className="form-control shadow-sm" placeholder="SĐT hoặc tên khách..." />
          </div>

          <div className="position-sticky" style={{ top: "80px" }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h3 className="mb-0 fw-bold">Hóa đơn</h3>
              <span className="badge bg-primary">{productList.length} món sẵn có</span>
            </div>
            <div className="card shadow-sm border-0">
              <div className="card-body p-0">
                <StaffOrder />
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}