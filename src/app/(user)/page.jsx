import AddToCart from "@/components/AddToCart";

export default async function Menu() {
  let productList = [];
  
  // Lấy URL từ môi trường, nếu không có thì mặc định là chuỗi rỗng
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/api/products`, { cache: 'no-store' });
      if (res.ok) {
        productList = await res.json();
      }
    } catch (error) {
      console.error("Lỗi fetch dữ liệu:", error);
    }
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
                <img src={`/img/${p.image}`} className="card-img-top" alt={p.name} style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    <strong className="text-primary">{p.price?.toLocaleString('vi-VN')}đ</strong>
                  </p>
                  <AddToCart product={p}>Thêm giỏ hàng</AddToCart>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <div className="alert alert-warning">
              Vui lòng kiểm tra cấu hình NEXT_PUBLIC_API_URL trên Vercel!
            </div>
          </div>
        )}
      </div>
    </main>
  );
}