import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProductList.css";
import ProductCard from "./ProductCard";
import ShoppingCartPopup from "./ShoppingCartPopup";
import { useCart } from "../contexts/CartContext";
import { FilterOptions } from "./Sidebar";

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

const CATEGORY_NAME_TO_ID: Record<string, number> = {
  Clothing: 1,
  Swimwear: 2,
  Accessories: 3,
};

interface SaleProductListProps {
  filters?: FilterOptions;
  page: number;
  limit: number;
  onTotalCountChange?: (total: number) => void;
}

const SaleProductList: React.FC<SaleProductListProps> = ({
  filters,
  page,
  limit,
  onTotalCountChange,
}) => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const { cart, addToCart, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    (async () => {
      try {
        // Ưu tiên lấy từ /api/products/sale nếu có, fallback sang /api/products
        let res = await fetch('http://localhost:3001/api/products/sale');
        if (!res.ok) res = await fetch('http://localhost:3001/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setAllProducts(Array.isArray(data) ? data : data.data);
      } catch (err) {
        console.error('Error loading products:', err);
      }
    })();
  }, []);

  const now = new Date();
  let saleProducts = allProducts.filter(
    p => p.productPromotions?.some(
      pp => pp.promotion && pp.promotion.discount_rate > 0 &&
        new Date(pp.promotion.start_at) <= now &&
        new Date(pp.promotion.end_at) >= now
    )
  );

  // Lọc theo category nếu có filter
  if (filters?.category && typeof filters.category === 'string' && CATEGORY_NAME_TO_ID.hasOwnProperty(filters.category)) {
    saleProducts = saleProducts.filter(p => p.category_id === CATEGORY_NAME_TO_ID[filters.category as keyof typeof CATEGORY_NAME_TO_ID]);
  }

  // Pagination
  const start = (page - 1) * limit;
  const currentItems = saleProducts.slice(start, start + limit);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleBuyNow = (product: Product) => {
    const price = product.productItems?.[0]?.price ?? 0;
    const img = product.productItems?.[0]?.images?.[0]?.image_url || '';
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: img,
    });
    setIsCartOpen(true);
  };

  return (
    <div className="product-list-container">
      <div className="product-container">
        {currentItems.length === 0 ? (
          <p className="no-product">No discounted products available.</p>
        ) : (
          currentItems.map(product => {
            const price = product.productItems?.[0]?.price ?? 0;
            const discountRate = product.productPromotions?.[0]?.promotion?.discount_rate ?? 0;
            const newPrice = discountRate > 0 ? Math.round(price * (1 - discountRate)) : price;
            const img = product.productItems?.[0]?.images?.[0]?.image_url || '';
            const isHovered = hoveredProduct === product.id;

            return (
              <div 
                key={product.id} 
                className="product"
                onClick={() => handleProductClick(product)}
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
      <ShoppingCartPopup
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
      />
    </div>
  );
};

export default SaleProductList;
