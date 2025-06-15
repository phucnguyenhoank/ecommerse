import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OrderManagement.css';
import InvoiceButton from "../components/InvoiceButton";

type Order = {
  id: number;
  user: { fullName: string } | null;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  order_total: number;
  orderDate: string;
  orderStatus: { status: string } | null;
};

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.ceil(totalCount / limit);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const loadOrders = () => {
    const query = `http://localhost:3001/admin/api/orders?page=${page}&limit=${limit}&search=${encodeURIComponent(searchTerm)}`;
    console.log("📦 Fetching orders from backend:", query);

    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) {
          setOrders(data.data);
          setTotalCount(data.totalCount || 0);
        } else {
          console.warn("⚠️ Dữ liệu trả về không đúng định dạng:", data);
          setOrders([]);
        }
      })
      .catch((err) => {
        console.error('❌ Lỗi khi tải đơn hàng:', err);
        setOrders([]);
      });
  };

  useEffect(() => {
    loadOrders();
  }, [page]);

  const handleDelete = (id: number) => {
    if (window.confirm('Xác nhận xoá đơn hàng này?')) {
      fetch(`http://localhost:3001/admin/api/orders/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (res.ok) loadOrders();
        })
        .catch((err) => console.error('❌ Lỗi khi xoá đơn hàng:', err));
    }
  };

  const handleDetail = (id: number) => {
    navigate(`/admin/orders/${id}`);
  };

  return (
    <div className="order-container">
      {/*  Thanh tìm kiếm */}
      <div className="search-bar">
  <input
    type="text"
    className="search-input"
    placeholder="Tìm theo tên, email hoặc ID..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button className="search-button" onClick={() => { setPage(1); loadOrders(); }}>
    Tìm
  </button>
</div>

      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Order Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order, index) => (
              <tr key={order.id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>
                  {order.user?.fullName || order.guest_name || 'Khách vãng lai'}
                  {order.guest_email && (
                    <>
                      <br /><small>{order.guest_email}</small>
                    </>
                  )}
                </td>
                <td>{(order.order_total ?? 0).toLocaleString()}₫</td>
                <td>{order.orderStatus?.status || 'Đang xử lý'}</td>
                <td>{order.orderDate ? new Date(order.orderDate).toLocaleString('vi-VN') : ''}</td>
                <td>
                  <button className="order-button btn-detail" onClick={() => handleDetail(order.id)}>Chi tiết</button>
                  <button className="order-button btn-delete" onClick={() => handleDelete(order.id)}>Xoá</button>
                  <InvoiceButton id={order.id} />
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={6}>Không có đơn hàng nào.</td></tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
            <button key={pageNumber}
              style={{
                margin: 4, padding: '8px 12px',
                backgroundColor: pageNumber === page ? '#333' : '#eee',
                color: pageNumber === page ? '#fff' : '#000',
                border: 'none', borderRadius: 4, cursor: 'pointer',
              }}
              onClick={() => setPage(pageNumber)}>{pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
