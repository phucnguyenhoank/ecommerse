import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "../styles/SearchResult.css";

interface ProductItem {
  price: number;
  images: {
    image_url: string;
  }[];
}

interface Product {
  id: number;
  name: string;
  productItems: ProductItem[];
}

const API_URL = "http://localhost:3001";

const SearchResult = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search).get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(query.trim())}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load data from the server.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="search-result-container">
      <h2 className="title">Search results for: "{query}"</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <p>No products found</p>
          ) : (
            <div className="product-grid">
              {products.map((product) => {
                const firstItem = product.productItems?.[0];
                const firstImage = firstItem?.images?.[0];
                const imageUrl = firstImage?.image_url?.trim() || "/default.jpg";
                const price = firstItem?.price;

                return (
                  <Link to={`/product/${product.id}`} className="product-card" key={product.id}>
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default.jpg";
                      }}
                    />
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">
                      {typeof price === "number"
                        ? `${price.toLocaleString()}₫`
                        : "No price available"}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResult;
