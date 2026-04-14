"use client";
import { useEffect, useState } from "react";

export default function Order() {
  const [orderList, setOrderList] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // Quản lý trạng thái chờ cho từng đơn hàng

  // Tự động lấy URL API từ môi trường
  const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

  async function fetchOrderList() {
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      if (res.ok) {
        const data = await res.json();
        // Sắp xếp đơn mới nhất lên đầu (nếu API chưa làm)
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setOrderList(sortedData);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách đơn hàng:", err);
    }
  }

  useEffect(() => {
    fetchOrderList();
    // Tùy chọn: Tự động cập nhật mỗi 20 giây để nhân viên thấy đơn mới ngay
    const interval = setInterval(fetchOrderList, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleConfirm = async (order) => {
    const statusList = {
      "don-moi": "che-bien",
      "che-bien": "cho-giao",
      "cho-giao": "hoan-thanh"
    };

    setLoadingId(order._id);
    try {
      const res = await fetch(`${API_URL}/api/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: statusList[order.status]
        })
      });

      const data = await res.json();
      if (data.status === "success") {
        await fetchOrderList(); // Reload lại data
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    } finally {
      setLoadingId(null);
    }
  };

  const handleCancel = async (order) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

    setLoadingId(order._id);
    try {
      const res = await fetch(`${API_URL}/api/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "da-huy" })
      });

      const data = await res.json();
      if (data.status === "success") {
        await fetchOrderList();
      }
    } catch (err) {
      alert("Lỗi kết nối server!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <main className="container-fluid mt-5 pt-5 bg-light min-vh-100">
      <h3 className="text-center mb-4 fw-bold">Danh sách đơn hàng tại quầy</h3>

      <div className="card shadow-sm border-0">
        <div className="table-responsive p-3">
          <table className="table table-hover align-middle">
            <thead className="table-dark text-center">
              <tr>
                <th>Mã đơn</th>
                <th>Bàn / Khách</th>
                <th>Sản phẩm</th>
                <th>Thời gian gọi</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {orderList.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="small text-muted">#{order._id.slice(-6)}</td>
                  <td className="fw-bold text-primary">
                    {order.table_info?.name || "Khách lẻ"}
                  </td>

                  <td className="text-start">
                    {order.order_items?.map((item, idx) => (
                      <div key={idx} className="small text-nowrap">
                        • {item.name} <span className="badge bg-secondary">x{item.quantity}</span>
                      </div>
                    ))}
                  </td>

                  <td>{new Date(order.created_at).toLocaleTimeString('vi-VN')}</td>

                  <td>{renderStatusBadge(order.status)}</td>

                  <td>
                    {order.status !== "hoan-thanh" && order.status !== "da-huy" ? (
                      <div className="btn-group gap-2">
                        <button
                          className="btn btn-success btn-sm px-3"
                          onClick={() => handleConfirm(order)}
                          disabled={loadingId === order._id}
                        >
                          {loadingId === order._id ? "..." : getButtonText(order.status)}
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleCancel(order)}
                          disabled={loadingId === order._id}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted small">Đã đóng đơn</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

// Hàm hỗ trợ UI: Badge trạng thái
function renderStatusBadge(status) {
  const config = {
    "don-moi": { bg: "text-bg-primary", text: "Đơn mới" },
    "che-bien": { bg: "text-bg-warning", text: "Chế biến" },
    "cho-giao": { bg: "text-bg-info", text: "Chờ giao" },
    "hoan-thanh": { bg: "text-bg-success", text: "Xong" },
    "da-huy": { bg: "text-bg-danger", text: "Đã hủy" }
  };
  const item = config[status] || { bg: "text-bg-dark", text: "N/A" };
  return <span className={`badge ${item.bg}`}>{item.text}</span>;
}

// Hàm hỗ trợ UI: Text nút bấm
function getButtonText(status) {
  if (status === "don-moi") return "Xác nhận";
  if (status === "che-bien") return "Xong món";
  if (status === "cho-giao") return "Giao hàng";
  return "Tiếp tục";
}