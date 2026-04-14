import AddToCart from "@/components/AddToCart";
// 1. Dùng đường dẫn tương đối để Vercel không báo lỗi Module not found
import clientPromise from "../../libs/mongodb"; 

export default async function Menu() {
  let productList = [];
  
  try {
    // 2. Chờ kết nối MongoDB hoàn tất
    const client = await clientPromise;
    
    // 3. Chọn database (Thay "SusanCoffee" bằng tên DB thật của bạn trên Atlas)
    const db = client.db("SusanCoffee"); 
    
    // 4. Lấy dữ liệu từ collection 'products'
    const data = await db.collection("products").find({}).toArray();
    
    // 5. Format lại dữ liệu (Bắt buộc chuyển _id thành string cho Next.js)
    productList = data.map(p => ({
      ...p,
      _id: p._id.toString()
    }));
    
  } catch (error) {
    console.error("Lỗi lấy dữ liệu từ MongoDB:", error);
  }

  const isArray = Array.isArray(productList) && productList.length > 0;

  return (
    <main className="container mt-5 pt-5">
      <h1 className="text-center mb-4">Menu Sản Phẩm</h1>
      <div className="row">
        {isArray ? (
          productList.map((p) => (
            <div key={p._id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                {/* Kiểm tra ảnh, nếu không có thì dùng ảnh mặc định */}
                <img 
                  src={p.image?.startsWith('http') ? p.image : `/img/${p.image}`} 
                  className="card-img-top" 
                  alt={p.name} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <div className="card-text mb-3">
                    <strong className="text-primary">{p.price?.toLocaleString('vi-VN')}đ</strong><br />
                    <small className="text-muted text-truncate d-block">{p.description}</small>
                  </div>
                  <div className="mt-auto">
                    <AddToCart product={p}>Thêm giỏ hàng</AddToCart>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="alert alert-warning">
              <p className="fw-bold mb-1">Hiện tại chưa có sản phẩm nào!</p>
              <p className="small mb-0">Hãy kiểm tra Collection 'products' trong Database 'SusanCoffee'.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}