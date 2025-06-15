import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import "../styles/CategoryPage.css";
import { useCart } from "../contexts/CartContext"; 

type Product = {
  id: number;
  name: string;
  productItems: {
    price: number;
    image: {
      image_url: string;
    };
  }[];
};

export default function CategoryPage() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    if (categoryName) {
      setLoading(true);
      fetch(`http://localhost:3001/api/products?category=${categoryName}`)
        .then((res) => {
          if (!res.ok) throw new Error("Lỗi khi lấy sản phẩm");
          return res.json();
        })
        .then((data) => setProducts(data))
        .catch((err) => console.error("Lỗi fetch:", err))
        .finally(() => setLoading(false));
    }
  }, [categoryName]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", textTransform: "uppercase" }}>
        {categoryName}
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p style={{ marginTop: "40px", color: "#666", fontSize: "18px" }}>
          🛒 There are no products in this category yet.
        </p>
      ) : (
        <div
          className="category-product-container"
          style={{ display: "flex", flexWrap: "wrap", gap: 20 }}
        >
          {products.map((product) => {
            const item = product.productItems?.[0]; 
            return (
              <div className="category-product-card" key={product.id}>
                <img src={item?.image?.image_url} alt={product.name} />
                <h3>{product.name}</h3>
                <p>{item?.price}₫</p>
                <div className="category-buy-btn">
                  <button
                    onClick={() => {
                      if (item) {
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: item.price,
                          image: item.image.image_url,
                        });
                        alert("Item added to cart!");
                      }
                    }}
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
