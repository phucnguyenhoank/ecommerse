import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import '../styles/ProductDetail.css';
import { useCart } from '../contexts/CartContext';

type ProductItem = {
  id: number;
  price: number;
  quantity: number;
  size: string | null;
  images: {image_url: string }[];
  color: { name: string; color_code: string };
  product: {
    id: number;
    name: string;
    description: string;
    all_rate: number;
    category_id: number;
  };
};

type Product = {
  id: number;
  name: string;
  description: string;
  all_rate: number;
  category: { id: number; name: string };
  productItems: ProductItem[];
};

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:3001/api/product-items/${id}`)
      .then((res) => res.json())
      .then((item: ProductItem) => {
        fetch(`http://localhost:3001/api/categories/${item.product.category_id}`)
          .then((res) => res.json())
          .then((category) => {
            const fullProduct: Product = {
              id: item.product.id,
              name: item.product.name,
              description: item.product.description,
              all_rate: item.product.all_rate,
              category: {
                id: item.product.category_id,
                name: category.name || 'Không rõ',
              },
              productItems: [item],
            };
            setProduct(fullProduct);
            setLoading(false);
          });
      })
      .catch((err) => {
        console.error('❌ Error loading product:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product || product.productItems.length === 0) return <p>Không tìm thấy sản phẩm.</p>;

  const item = product.productItems[0];
  const imageUrl = (img: any) => img?.image_url || '/fallback.jpg';

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: product.name,
      price: item.price,
      image: imageUrl(item.images[0]),
    });
    alert('✔ Sản phẩm đã được thêm vào giỏ hàng');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="product-page">
      <div className="product-main">
        <div className="product-images">
          <div className="thumbnail-gallery">
            {item.images?.map((img, index) => (
              <img
                key={index}
                src={imageUrl(img)}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                onClick={() => setSelectedImageIndex(index)}
              />
            ))}
          </div>
          <div className="main-image">
            <img src={imageUrl(item.images[selectedImageIndex])} alt="Main" />
          </div>
        </div>

        <div className="product-details">
        
          <h1>{product.name}</h1>
          <p className="price">{item.price.toLocaleString()}₫</p>
          <p className="description">{product.description}</p>

          <div className="color-selection">
            <span>Màu: </span>
            <div
              className="color-circle"
              style={{ backgroundColor: item.color?.color_code || '#ccc' }}
              title={item.color?.name}
            ></div>
          </div>

          {item.size && (
            <div className="size-selection">
              <span>Size: </span>
              <button className="size-button">{item.size}</button>
            </div>
          )}

          <div className="quantity-selection">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart" onClick={handleAddToCart}>THÊM VÀO GIỎ</button>
            <button className="buy-now" onClick={handleBuyNow}>MUA NGAY</button>
          </div>

          <div className="product-meta">
            <p><strong>SKU:</strong> N/A</p>
            <p><strong>Danh mục:</strong> {product.category.name}</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>
          MÔ TẢ
        </button>
        <button className={`tab ${activeTab === 'additional' ? 'active' : ''}`} onClick={() => setActiveTab('additional')}>
          THÔNG TIN BỔ SUNG
        </button>
        <button className={`tab ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
          ĐÁNH GIÁ (0)
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'description' && (
          <p>Thông tin mô tả sản phẩm sẽ được hiển thị ở đây.</p>
        )}
        {activeTab === 'additional' && (
          <table>
            <tbody>
              <tr>
                <td>Màu</td>
                <td>{item.color?.name || 'N/A'}</td>
              </tr>
              <tr>
                <td>Size</td>
                <td>{item.size || 'N/A'}</td>
              </tr>
              <tr>
                <td>Số lượng còn lại</td>
                <td>{item.quantity}</td>
              </tr>
            </tbody>
          </table>
        )}
        {activeTab === 'reviews' && (
          <p>Chưa có đánh giá nào.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
