import AddToCart from "@/components/AddToCart";
// 1. Import hàm kết nối và Model (thay đổi đường dẫn cho đúng với project của bạn)
import { connectDB } from "@/lib/mongodb"; 
import Product from "@/models/Product"; 

export default async function Menu() {
  let productList = [];
  
  try {
    // 2. Kết nối trực tiếp với Database thay vì dùng fetch qua URL
    await connectDB();
    
    // 3. Lấy dữ liệu trực tiếp từ MongoDB (dùng .lean() để trả về mảng JSON thuần)
    productList = await Product.find({}).lean();
    
  } catch (error) {
    console.error("Lỗi lấy dữ liệu Database:", error);
  }

  // Chuyển đổi _id từ Object sang String để không bị lỗi trên Client Component
  const formattedProducts = productList.map(p => ({
    ...p,
    _id: p._id.toString()
  }));

  const isArray = Array.isArray(formattedProducts) && formattedProducts.length > 0;

  return (
    <main className="container mt-5 pt-5">
      <h1 className="text-center mb-4">Menu Sản Phẩm</h1>
      <div className="row">
        {isArray ? (
          formattedProducts.map((p) => (
            <div key={p._id} className="col-md-3 mb-4">
              <div className="card h-100 shadow-sm">
                <img 
                  src={p.image?.startsWith('http') ? p.image : `/img/${p.image}`} 
                  className="card-img-top" 
                  alt={p.name} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <div className="card-text mb-3">
                    <strong className="text-primary">{p.price?.toLocaleString('vi-VN')}đ</strong><br />
                    <small className="text-muted text-truncate d-block">{p.description}</small>
                  </div>
                  <AddToCart product={p}>Thêm giỏ hàng</AddToCart>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="alert alert-warning">
              <p className="fw-bold mb-1">Hiện tại chưa có sản phẩm nào!</p>
              <p className="small mb-0">Hãy thêm món mới từ trang Quản trị.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}