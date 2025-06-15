import "../styles/orderlist.css"
import React from 'react';
function OrderList() {
    return (<div>
        <h1>Order List</h1>
        <table>
            <thead>
            <tr>
                <th>Order ID</th>
                <th>Order date</th>
                <th>Shipping method</th>
                <th>Shipping address</th>
                <th>Status</th>
                <th>Total</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>#12345</td>
                <td>March 14, 2025</td>
                <td>Express</td>
                <td>123 Main St, City</td>
                <td>Shipping</td>
                <td>$150</td>
                <td><a href="#">View</a></td>
            </tr>
            </tbody>
        </table>
    </div>);
}

export default OrderList;