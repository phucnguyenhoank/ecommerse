import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AccessoriesPage from "./pages/AccessoriesPage";
import "./styles/app.css";
import Home from "./pages/Home";
import Sale from "./pages/Sale";
import Footer from "./components/Footer";
import Swimwear from "./pages/Swimwear";
import ClothingPage from "./pages/ClothingPage";
import MyAccount from "./pages/MyAccount";
import ItemPage from "./pages/ItemPage";
import LoginSection from "./pages/LoginSection";
import RegisterSection from "./pages/RegisterSection";
import ShoppingCartPopup from "./components/ShoppingCartPopup";
import ForgotPassword from "./components/ForgotPassword";
import ProductManagement from "./components/ProductManagement";
import OrderManagement from "./components/OrderManagement";
import OrderDetails from "./components/OrderDetails";
import SearchResult from "./pages/SearchResult";
import { CartProvider } from "./contexts/CartContext"; 
import CartPopupWrapper from "./components/CartPopupWrapper"; 
import "./assets/themify-icons/themify-icons.css";
import CheckoutPage from "./pages/CheckoutPage";
import CategoryPage from "./pages/CategoryPage";
import AdminLayout from "./components/AdminLayout";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoryAdminPage from "./components/CategoryAdminPage";
import AdminDashboard from "./pages/Dashboard";
import UserManagement from "./components/Usermanangement";

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <CartProvider>
      <Router>
        <Navbar onCartClick={() => setCartOpen(true)} />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<CategoryPage />} />

          <Route path="/clothing" element={<ClothingPage />} />
          <Route path="/swimwear" element={<Swimwear />} />
          <Route path="/accessories" element={<AccessoriesPage />} />
          <Route path="/sale" element={<Sale />} />
          <Route path="/myaccount/*" element={<MyAccount />} />
          <Route path="/item/*" element={<ItemPage />} />
          <Route path="/login" element={<LoginSection />} />
          <Route path="/signup" element={<RegisterSection />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/clothing/:category" element={<ClothingPage />} />

          {/* Order Detail dành cho User */}
          <Route path="/orders/:id" element={<OrderDetails />} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="orders" element={<OrderManagement />} />
            <Route path="orders/:id" element={<OrderDetails />} />  {/* 🟢 Thêm chi tiết admin */}
            <Route path="categories" element={<CategoryAdminPage />} />
          </Route>
        </Routes>

        <CartPopupWrapper cartOpen={cartOpen} setCartOpen={setCartOpen} />
        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;
