// Layout.jsx
// import { useState } from "react";
import SidebarMenu from "./SidebarMenu";
import { Outlet } from "react-router-dom";

export default function Layout() {
  // const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <SidebarMenu />
      <main className="pt-14">
        <Outlet />
      </main>
    </>
  );
}
