import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import UserProfile from "../pages/user/UserProfile";
import Login from "../pages/user/Login";

import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
// import useTokenWatcher from "../hooks/useTokenWatcher";
import Dashboard from "../pages/dashboard/Dashboard";
import Layout from "../components/menu/Layout";
import NotFoundPage from "../pages/NotFoundPage";
import Product from "../pages/product/Product";
import SearchProducts from "../pages/product/SearchProducts";
import Person from "../pages/person/Person";
import SearchPeople from "../pages/person/SearchPeople";
import Invoice from "../pages/invoice/Invoice";
import UserList from "../pages/user/UserList";
import InvoiceDefaultDescription from "../pages/invoice/InvoiceDefaultDescription";

export default function AppRoutes() {
  //useTokenWatcher(); // بررسی انقضای توکن در هر بار لود

  return (
    <Routes>
      {/* صفحه ورود (عمومی) */}
      <Route
        path="/login"
        element={
          <PublicRoutes>
            <Login />
          </PublicRoutes>
        }
      />

      {/* صفحات محافظت‌شده با Layout */}
      <Route
        element={
          <PrivateRoutes>
            <Layout />
          </PrivateRoutes>
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="users/profile" element={<UserProfile />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/products/new" element={<Product />} />
        <Route path="/products/:id" element={<Product />} />
        <Route path="/products/list" element={<SearchProducts />} />
        <Route path="person/new" element={<Person />} />
        <Route path="person/:id" element={<Person />} />
        <Route path="person/search" element={<SearchPeople />} />
        <Route path="/invoice/new" element={<Invoice />} />
        <Route path="/invoice/:id" element={<Invoice />} />
        <Route path="/users/list" element={<UserList />} />
        <Route
          path="/invoice/defaultDesc"
          element={<InvoiceDefaultDescription />}
        />
      </Route>

      {/* سایر صفحات عمومی یا خطا */}
      <Route path="/unauthorized" element={<p>دسترسی غیرمجاز</p>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
