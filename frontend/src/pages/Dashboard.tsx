import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    orders: 0,
    users: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInitialStats = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes, orderRes, userRes] = await Promise.all([
          fetch("http://localhost:3001/api/categories"),
          fetch("http://localhost:3001/api/products"),
          fetch("http://localhost:3001/api/orders/count"),
          fetch("http://localhost:3001/api/users/count"),
        ]);

        const [catData, prodData, orderData, userData] = await Promise.all([
          catRes.json(),
          prodRes.json(),
          orderRes.json(),
          userRes.json(),
        ]);

        setStats({
          categories: Array.isArray(catData) ? catData.length : 0,
          products: typeof prodData.totalCount === "number" ? prodData.totalCount : 0,
          orders: typeof orderData.count === "number" ? orderData.count : 0,
          users: typeof userData.count === "number" ? userData.count : 0,
        });
      } catch (err) {
        console.error("❌ Lỗi khi lấy thống kê:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialStats();
  }, []);

  return (
    <div className="dashboard-container">
      <h1>Welcome to the admin page</h1>

      {loading ? (
        <p>Loading..</p>
      ) : (
        <div className="stats-boxes">
          <div className="stat-box">
            <h2>Categories</h2>
            <p>{stats.categories}</p>
          </div>
          <div className="stat-box">
            <h2>Products</h2>
            <p>{stats.products}</p>
          </div>
          <div className="stat-box">
            <h2>Orders</h2>
            <p>{stats.orders}</p>
          </div>
          <div className="stat-box">
            <h2>Users</h2>
            <p>{stats.users}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
