import clientPromise from "@/libs/mongodb";
import { ObjectId } from "mongodb";

export async function PATCH(request, { params }) {
  try {
    const client = await clientPromise;
    // Đảm bảo điền đúng tên database của bạn
    const db = client.db("SusanCoffee"); 

    // CHÚ Ý: Trong Next.js 15+, params là một Promise, cần dùng await
    const { id } = await params; 
    
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return Response.json(
        { status: "error", message: "Thiếu thông tin trạng thái" },
        { status: 400 }
      );
    }

    // Thực hiện cập nhật vào Collection "orders"
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          updated_at: new Date() // Nên thêm thời gian cập nhật để dễ quản lý
        } 
      }
    );

    // Kiểm tra xem có tìm thấy đơn hàng để cập nhật không
    if (result.matchedCount === 0) {
      return Response.json(
        { status: "error", message: "Không tìm thấy đơn hàng để cập nhật" },
        { status: 404 }
      );
    }

    return Response.json({ status: "success", message: "Cập nhật thành công" });

  } catch (error) {
    console.error("Lỗi API PATCH Order:", error);
    return Response.json(
      { status: "error", error: "Cập nhật trạng thái thất bại" },
      { status: 500 }
    );
  }
}