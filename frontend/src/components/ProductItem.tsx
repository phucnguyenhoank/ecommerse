import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ProductItem.css';

const ProductItem: React.FC = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [relatedPage, setRelatedPage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    fetch(`http://localhost:3001/api/product-items/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch product details');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ Error fetching product:', err);
        setLoading(false);
      });
  }, [productId]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  const imageUrl = (img: any) =>
    img?.cloudinary_url || img?.image_url || '/fallback.jpg';

  return (
    <div className="product-page">
      <div className="product-main">
        <div className="product-images">
          <div className="thumbnail-gallery">
            {product.images?.map((img: any, index: number) => (
              <img
                key={index}
                src={imageUrl(img)}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${currentImage === index ? 'active' : ''}`}
                onClick={() => setCurrentImage(index)}
              />
            ))}
          </div>
          <div className="main-image">
            <img
              src={imageUrl(product.images?.[currentImage])}
              alt="Product"
            />
          </div>
        </div>

        <div className="product-details">
          <div className="breadcrumb">
            <Link to="/">Home</Link> {product.id}
          </div>
          <h1>{product.product?.name || `Product #${product.id}`}</h1>
          <p className="price">{product.price?.toFixed(2)}₫</p>
          <p className="description">
            Color: {product.color?.name || 'N/A'} — Quantity available: {product.quantity}
          </p>

          <div className="color-selection">
            <span>Color: </span>
            <div
              className="color-circle"
              style={{ backgroundColor: product.color?.color_code || '#ccc' }}
            ></div>
          </div>

          {product.size && (
            <div className="size-selection">
              <span>Size: </span>
              <button className="size-button">{product.size}</button>
            </div>
          )}

          <div className="quantity-selection">
            <button onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>

          <div className="action-buttons">
            <button className="add-to-cart">ADD TO CART</button>
            <button className="buy-now">BUY NOW</button>
          </div>

          <div className="product-meta">
            <p>SKU: N/A</p>
            <p>Category ID: {product.product?.category_id || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'description' ? 'active' : ''}`}
          onClick={() => setActiveTab('description')}
        >
          DESCRIPTION
        </button>
        <button
          className={`tab ${activeTab === 'additional' ? 'active' : ''}`}
          onClick={() => setActiveTab('additional')}
        >
          ADDITIONAL INFORMATION
        </button>
        <button
          className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          REVIEWS (0)
        </button>
      </div>

      {activeTab === 'description' && (
        <div className="tab-content">
          <p>Thông tin mô tả sản phẩm sẽ được hiển thị ở đây.</p>
        </div>
      )}
      {activeTab === 'additional' && (
        <div className="tab-content">
          <table>
            <tbody>
              <tr>
                <td>Color</td>
                <td>{product.color?.name || 'N/A'}</td>
              </tr>
              <tr>
                <td>Size</td>
                <td>{product.size || 'N/A'}</td>
              </tr>
              <tr>
                <td>Quantity</td>
                <td>{product.quantity}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      {activeTab === 'reviews' && (
        <div className="tab-content">
          <p>No reviews yet.</p>
        </div>
      )}
    </div>
  );
};

export default ProductItem;
