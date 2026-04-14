import AddToCart from "@/components/AddToCart";

export default async function Menu() {
  let productList = [];
  
  try {
    // Thêm no-store để luôn lấy dữ liệu mới từ Cloud MongoDB
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/products`, { 
      cache: 'no-store' 
    });
    
    if (res.ok) {
      productList = await res.json();
    }
  } catch (error) {
    console.error("Fetch error:", error);
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
              <p className="fw-bold mb-1">Chưa có sản phẩm nào hoặc lỗi kết nối!</p>
              <p className="small mb-0">Hãy kiểm tra MONGODB_URI và IP Access List trên Atlas.</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}