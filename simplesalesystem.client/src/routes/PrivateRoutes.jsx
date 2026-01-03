import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PrivateRoutes({ children }) {
  const currentUser = useSelector((state) => state.user.currentUser);

  if (!(currentUser?.token?.length > 10)) {
    // اگر لاگین نبود، می‌فرستیم صفحه ورود
    return <Navigate to="/login" replace />;
  }

  // اگر لاگین بود، کامپوننت فرزند رو رندر می‌کنه
  return children;
}
