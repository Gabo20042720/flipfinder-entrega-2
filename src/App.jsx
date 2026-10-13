import React from 'react';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Footer from './components/Footer.jsx';
import { useCart, useSession } from './hooks/useStores.js';
import { logout } from './data/auth.js';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CategoriesPage from './pages/Categories.jsx';
import Offers from './pages/Offers.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderResult from './pages/OrderResult.jsx';
import { Login, Register } from './pages/Auth.jsx';
import { About, Blogs, BlogDetail, Contact, NotFound } from './pages/Static.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import { OrdersList, OrderDetail } from './pages/admin/Orders.jsx';
import { AdminProducts, CriticalProducts, ProductNew, ProductEdit } from './pages/admin/AdminProducts.jsx';
import { AdminCategories, CategoryNew, CategoryEdit } from './pages/admin/AdminCategories.jsx';
import { AdminUsers, UserNew, UserEdit, UserDetail } from './pages/admin/AdminUsers.jsx';
import { Reports, Profile } from './pages/admin/Reports.jsx';

function StoreLayout() {
  const user = useSession();
  const { total, count } = useCart();
  const navigate = useNavigate();
  return (
    <>
      <NavBar user={user} cartTotal={total} cartCount={count} onLogout={() => { logout(); navigate('/'); }} />
      <main className="container py-4"><Outlet /></main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Products />} />
        <Route path="productos/:id" element={<ProductDetail />} />
        <Route path="categorias" element={<CategoriesPage />} />
        <Route path="categorias/:id" element={<CategoriesPage />} />
        <Route path="ofertas" element={<Offers />} />
        <Route path="carrito" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="compra/exitosa/:id" element={<OrderResult success />} />
        <Route path="compra/error/:id" element={<OrderResult success={false} />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Register />} />
        <Route path="nosotros" element={<About />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<BlogDetail />} />
        <Route path="contacto" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="ordenes" element={<OrdersList />} />
        <Route path="ordenes/:id" element={<OrderDetail />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="productos/nuevo" element={<ProductNew />} />
        <Route path="productos/criticos" element={<CriticalProducts />} />
        <Route path="productos/:id/editar" element={<ProductEdit />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="categorias/nueva" element={<CategoryNew />} />
        <Route path="categorias/:id/editar" element={<CategoryEdit />} />
        <Route path="usuarios" element={<AdminUsers />} />
        <Route path="usuarios/nuevo" element={<UserNew />} />
        <Route path="usuarios/:id" element={<UserDetail />} />
        <Route path="usuarios/:id/editar" element={<UserEdit />} />
        <Route path="reportes" element={<Reports />} />
        <Route path="perfil" element={<Profile />} />
      </Route>
    </Routes>
  );
}
