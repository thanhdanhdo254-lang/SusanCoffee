"use client";
import { useEffect, useState } from "react";

export default function Table() {
  const [tables, setTablesList] = useState([]);
  const [tableName, setTableName] = useState("");
  const [tableLocation, setTableLocation] = useState("");
  const [tableId, setTableId] = useState(null);

  // 1. Hàm lấy danh sách dữ liệu
  async function fetchedTables() {
    try {
      const res = await fetch('http://localhost:3000/api/tables');
      const data = await res.json();
      setTablesList(data);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  }

  useEffect(() => {
    fetchedTables();
  }, []);

  // 2. Hàm Xử lý Xóa
    const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa bàn này không?")) {
      try {
        const res = await fetch(`http://localhost:3000/api/tables/${id}`, {
          method: 'DELETE',
        });
        
        const result = await res.json();

        // SỬA Ở ĐÂY: Kiểm tra nếu res.ok (status code 200-299) 
        // hoặc kiểm tra đúng trường mà API của bạn trả về
        if (res.ok || result.status === "success" || result.message.includes("thành công")) {
          alert("Xóa thành công!");
          fetchedTables(); 
          if (tableId === id) handleReset();
        } else {
          // Chỉ hiện lỗi khi thực sự có lỗi từ server
          alert("Xóa thất bại: " + (result.message || "Lỗi không xác định"));
        }
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Không thể kết nối đến server");
      }
    }
  };

  // 3. Hàm Xử lý Thêm / Sửa
  const handleSubmit = async (e) => {
    e.preventDefault();

    const tableData = {
      name: tableName,
      location: tableLocation
    };

    try {
      if (!tableId) {
        // --- CHẾ ĐỘ THÊM MỚI ---
        const res = await fetch('http://localhost:3000/api/tables', {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tableData)
        });
        const result = await res.json();
        
        // Kiểm tra res.ok (status 200-299) cho chắc chắn
        if (res.ok || result.status === "success") {
          alert("Thêm bàn thành công!");
          fetchedTables();
          handleReset();
        } else {
          alert("Lỗi thêm mới: " + (result.message || "Không xác định"));
        }

      } else {
        // --- CHẾ ĐỘ CẬP NHẬT ---
        const res = await fetch(`http://localhost:3000/api/tables/${tableId}`, {
          method: 'PATCH', // Nếu vẫn không được, hãy thử đổi thành 'PUT'
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(tableData)
        });
        
        const result = await res.json();

        // FIX Ở ĐÂY: Nới lỏng điều kiện kiểm tra giống như hàm Xóa
        if (res.ok || result.status === "success" || (result.message && result.message.includes("thành công"))) {
          alert("Cập nhật thành công!");
          await fetchedTables(); // Tải lại danh sách mới
          handleReset();         // Xóa trắng form và đưa về chế độ "Thêm"
        } else {
          alert("Cập nhật thất bại: " + (result.message || "Vui lòng kiểm tra lại"));
        }
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      alert("Không thể kết nối đến server!");
    }
  };

  const handleUpdate = (table) => {
    setTableId(table._id);
    setTableName(table.name);
    setTableLocation(table.location);
  };

  const handleReset = () => {
    setTableId(null);
    setTableName("");
    setTableLocation("");
  };

  return (
    <div className="content">
      <div className="row">
        {/* CỘT DANH SÁCH */}
        <div className="col-md-8">
          <div className="card shadow mb-4">
            <div className="card-body">
              <h4 className="card-title mb-3">Danh sách bàn</h4>
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>STT</th>
                      <th>ID</th>
                      <th>Tên bàn</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table, index) => (
                      <tr key={table._id}>
                        <td>{index + 1}</td>
                        <td>{table._id}</td>
                        <td>{table.name}</td>
                        <td>
                          <button 
                            className="btn btn-warning btn-sm me-2" 
                            onClick={() => handleUpdate(table)}
                          >
                            Sửa
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(table._id)} // GẮN HÀM XÓA VÀO ĐÂY
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* CỘT FORM NHẬP */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title mb-3">{tableId ? "Sửa" : "Thêm"} bàn</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="tableName" className="form-label">Tên bàn</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tableName"
                    placeholder="Ví dụ: Bàn số 1"
                    required
                    onChange={(e) => setTableName(e.target.value)}
                    value={tableName}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="tableLocation" className="form-label">Vị trí/Mô tả</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tableLocation"
                    placeholder="Ví dụ: Tầng 1 - Khu A"
                    required
                    onChange={(e) => setTableLocation(e.target.value)}
                    value={tableLocation}
                  />
                </div>

                <button type="submit" className="btn btn-dark me-2">
                  {tableId ? "Cập nhật" : "Lưu bàn"}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                  Hủy
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}