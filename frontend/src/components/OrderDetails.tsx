import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/OrderDetails.css";

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:3001/admin/api/orders/${id}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loading) return <div>Đang tải...</div>;
  if (!order) return <div>Không tìm thấy đơn hàng.</div>;

  const orderItems: OrderItem[] =
    order.orderItems?.map((item: any) => ({
      id: item.id,
      name: item.productItem?.product?.name || "Không rõ",
      quantity: parseInt(item.quantity),
      price: parseFloat(item.price),
      // Fix chỗ image đúng relations bạn đang trả về:
      image: item.productItem?.images?.[0]?.image_url || "", 
    })) || [];

  const fullAddress =
    order.shippingAddress?.fullAddress ||
    `${order.shippingAddress?.street_name || ""}, ${order.shippingAddress?.district || ""}, ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.region || ""}, ${order.shippingAddress?.country || ""}`;

  return (
    <div className="order-details">
      <h2>Đơn hàng #{order.id}</h2>

      <div className="order-info">
        <p><strong>Ngày đặt:</strong> {order.orderDate ? new Date(order.orderDate).toLocaleString() : ""}</p>
        <p><strong>Trạng thái:</strong> {order.orderStatus?.name || "Không rõ"}</p>
        <p><strong>Khách hàng:</strong> {order.user?.fullName || order.guest_name || "Không rõ"}</p>
        <p><strong>Điện thoại:</strong> {order.user?.phone || order.guest_phone || "Không rõ"}</p>
        <p><strong>Email:</strong> {order.user?.email || order.guest_email || "Không rõ"}</p>
        <p><strong>Địa chỉ giao hàng:</strong> {fullAddress}</p>
        <p><strong>Giao hàng:</strong> {order.shippingMethod?.name || "Không rõ"}</p>
        <p><strong>Thanh toán:</strong> 
          {order.payment?.payment_method
            ? `${order.payment.payment_method} (${order.payment.is_paid ? "Đã thanh toán" : "Chưa thanh toán"})`
            : "Chưa có thông tin"}
        </p>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Sản phẩm</th>
            <th>Đơn giá</th>
            <th>SL</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {item.image && (
                    <img src={item.image} alt={item.name} width={40} height={40} />
                  )}
                  {item.name}
                </div>
              </td>
              <td>{item.price.toLocaleString()}₫</td>
              <td>{item.quantity}</td>
              <td>{(item.price * item.quantity).toLocaleString()}₫</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="order-total">
        Tổng tiền: {parseFloat(order.order_total ?? 0).toLocaleString()}₫
      </div>
    </div>
  );
};

export default OrderDetails;
