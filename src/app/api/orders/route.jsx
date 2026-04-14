import clientPromise from "@/libs/mongodb";
import { ObjectId } from "mongodb"; // Bỏ Code, chỉ cần ObjectId

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("SusanCoffee");

    const orderList = await db.collection("orders").aggregate([
      {
        $lookup: {
          from: "tables",
          localField: "table_id",
          foreignField: "_id",
          as: "table_info",
        },
      },
      {
        $unwind: {
          path: "$table_info",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { created_at: -1 } } // Sắp xếp đơn mới nhất lên đầu
    ]).toArray();

    return Response.json(orderList);
  } catch (error) {
    console.error("Lỗi GET orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("SusanCoffee");

    const body = await request.json();
    const { name, table_id, order_items, total } = body;

    // Kiểm tra dữ liệu đầu vào
    if (!table_id || !order_items || order_items.length === 0) {
      return Response.json({ error: "Thông tin đơn hàng không hợp lệ" }, { status: 400 });
    }

    const newOrder = {
      name: name || "Khách vãng lai",
      // Quan trọng: Phải chuyển table_id từ string sang ObjectId để join bảng sau này
      table_id: new ObjectId(table_id), 
      order_items,
      total: Number(total),
      created_at: new Date(),
      status: "don-moi"
    };

    const result = await db.collection("orders").insertOne(newOrder);

    return Response.json({
      message: "Đơn hàng đã được tạo thành công!",
      code: "success",
      orderId: result.insertedId
    });
  } catch (error) {
    console.error("Lỗi POST order:", error);
    return Response.json({ error: 'Không thể tạo đơn hàng' }, { status: 500 });
  }
}