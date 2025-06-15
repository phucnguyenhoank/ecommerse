import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Onsale.css';

interface ProductPromotion {
  promotion: {
    discount_rate: number;
    start_at: string;
    end_at: string;
  };
}

interface ProductItem {
  price: number;
  images?: { image_url?: string }[];
}

interface Product {
  id: number;
  name: string;
  category_id: number;
  productItems: ProductItem[];
  productPromotions: ProductPromotion[];
}

// Thay các số dưới đây bằng category_id thực tế của bạn
const CATEGORY_MAP: Record<string, number[]> = {
  clothing: [1], // ví dụ: 1 là id của clothing
  swimwear: [2],
  accessories: [3],
};

const OnSale: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'clothing' | 'swimwear' | 'accessories'>('clothing');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // Ưu tiên lấy từ /api/products/sale nếu có, fallback sang /api/products
        let res = await fetch('http://localhost:3001/api/products/sale');
        if (!res.ok) res = await fetch('http://localhost:3001/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        // Nếu là dạng {data: [...], totalCount: ...} thì lấy data.data
        setAllProducts(Array.isArray(data) ? data : data.data);
      } catch (err) {
        console.error('Error loading products:', err);
      }
    })();
  }, []);

  // Lọc sản phẩm có discount và đúng category
  const now = new Date();
  const saleProducts = allProducts.filter(
    p => p.productPromotions?.some(
      pp => pp.promotion && pp.promotion.discount_rate > 0 &&
        new Date(pp.promotion.start_at) <= now &&
        new Date(pp.promotion.end_at) >= now
    ) && CATEGORY_MAP[selectedCategory].includes(p.category_id)
  );

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="home-container">
      <h1 className="section-title">ON SALE</h1>
      <div className="categories">
        <button onClick={() => setSelectedCategory('clothing')}>Clothing</button>
        <button onClick={() => setSelectedCategory('swimwear')}>Swimwear</button>
        <button onClick={() => setSelectedCategory('accessories')}>Accessories</button>
      </div>
      <div className="category-products">
        {saleProducts.length === 0 ? (
          <p>No products on sale in this category.</p>
        ) : (
          saleProducts.map((product) => {
            const price = product.productItems?.[0]?.price ?? 0;
            const discountRate = product.productPromotions?.[0]?.promotion?.discount_rate ?? 0;
            const newPrice = discountRate > 0 ? Math.round(price * (1 - discountRate)) : price;
            const img = product.productItems?.[0]?.images?.[0]?.image_url || '';
            const isHovered = hoveredProduct === product.id;

            return (
              <div 
                key={product.id} 
                className="product"
                onClick={() => handleProductClick(product.id)}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {img && <img src={img} alt={product.name} />}
                <p className="product-name">{product.name}</p>
                <p className="product-price">
                  <span style={{ textDecoration: 'line-through', color: '#999' }}>{price.toLocaleString()}₫</span>
                  <br />
                  <span style={{ color: '#e44d26', fontWeight: 'bold' }}>{newPrice.toLocaleString()}₫</span>
                  {discountRate > 0 && <span className="sale-badge">SALE</span>}
                </p>
                {isHovered && (
                  <div className="buy-now-overlay">
                    Buy Now
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default OnSale;