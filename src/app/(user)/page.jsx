import AddToCart from "@/components/AddToCart";
// Sửa lại đúng tên thư mục 'libs' của bạn
import { connectDB } from "@/libs/mongodb"; 
// Kiểm tra lại xem file Product.js nằm trong src/models hay src/libs/models
import Product from "@/models/Product"; 

export default async function Menu() {
  let productList = [];
  
  try {
    await connectDB();
    // Lấy dữ liệu trực tiếp, không qua fetch URL
    productList = await Product.find({}).lean();
  } catch (error) {
    console.error("Lỗi lấy dữ liệu:", error);
  }

  // Chuyển _id thành string để tránh lỗi truyền object từ Server sang Client
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
                    <small className="text-muted">{p.description}</small>
                  </div>
                  <AddToCart product={p}>Thêm giỏ hàng</AddToCart>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="alert alert-warning">
              Chưa có sản phẩm nào. Hãy kiểm tra kết nối MongoDB Atlas!
            </div>
          </div>
        )}
      </div>
    </main>
  );
}