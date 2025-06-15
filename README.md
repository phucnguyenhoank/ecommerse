# Clothe Shop Online
An online clothing store web application with secure authentication, a React.js frontend, an Express.js backend, SQL Server as the database, and Keycloak for user authentication and role-based access control.

---

##  Features

### Frontend (React.js)
- Product list, detail, and shopping cart
- User authentication (login/register)
- Admin panel for managing products

### Backend (Express.js + SQL Server)
- RESTful API with CRUD operations for:
    - Users (Admin only)
    - Products
    - Orders
- JWT-based authentication integrated with Keycloak
- Middleware for role-based authorization

### Authentication (Keycloak in Docker)
- User registration and login
- Roles: `user`, `admin`
- Protect APIs using Keycloak access tokens

---

## Basic Business Requirements

1. **User Registration/Login**  
   Users can register and log in via Keycloak. Authenticated users can view products and manage their cart.

2. **Product Management (Admin only)**  
   Admins can add, edit, delete clothing products.

3. **Product Browsing**  
   Users can browse product listings and view product details.

4. **Cart & Order Placement** (Optional Future Enhancement)  
   Users can add items to cart and place orders (basic structure in place).

---


