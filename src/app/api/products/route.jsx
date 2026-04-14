import clientPromise from "@/libs/mongodb";

// 1. Lấy danh sách sản phẩm
export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db("Susan-Coffee"); 
        
        const productsList = await db.collection("products").find({}).toArray();
        return Response.json(productsList);
    } catch (error) {
        console.error("Lỗi GET:", error);
        return Response.json({ error: 'Failed to fetch products' }, { status: 500 });   
    }
}

// 2. Thêm sản phẩm mới (SỬA TẠI ĐÂY)
export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db("Susan-Coffee");
        
        // Đọc dữ liệu từ body của request gửi lên
        const body = await request.json();
        const { name, price, status } = body;

        // Kiểm tra dữ liệu đầu vào cơ bản
        if (!name || !price) {
            return Response.json({ error: "Thiếu tên hoặc giá sản phẩm" }, { status: 400 });
        }

        // Thực hiện chèn vào database
        const result = await db.collection("products").insertOne({
            name,
            price: Number(price), // Đảm bảo giá là kiểu số
            status: status || "active",
            createdAt: new Date()
        });

        return Response.json({ 
            status: "success", 
            message: "Thêm sản phẩm thành công!",
            id: result.insertedId 
        }, { status: 201 });

    } catch (error) {
        console.error("Lỗi POST:", error);
        return Response.json({ error: 'Không thể thêm sản phẩm', detail: error.message }, { status: 500 });
    }
}