import { useState } from "react";
import { IoMenu, IoClose } from "react-icons/io5";
import MenuItem from "./MenuItem";
// import { menuData } from "./menuData";
import { Link } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaUserAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/user/userSlice";
import { CgLogOff } from "react-icons/cg";

export default function SidebarMenu() {
  const [isOpen, setOpen] = useState(false);
  const user = useSelector((state) => state.user.currentUser);
  const dispatch = useDispatch();

  return (
    <>
      {/* دکمه toggle همبرگری - فقط موبایل */}
      {/* <button
        onClick={() => setOpen(true)}
        className={`
                    fixed top-4 right-4 z-500 bg-gray-800 text-white p-2 rounded
                    transition-opacity duration-500 ease-in-out md:hidden lg:hidden
                    ${
                      isOpen
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100 pointer-events-auto"
                    }
                    `}
        aria-label="باز کردن منو"
      >
        <IoMenu size={24} />
      </button> */}
      <header className="hidden md:flex fixed top-0 right-0 left-0 h-14 bg-cyan-900 text-white items-center p-4 z-50 shadow-gray-500 shadow">
        <nav>
          <ul className="flex flex-row gap-1">
            {/* <li className="relative group">
              <button
                onClick={() => setOpen(true)}
                className={`
                    right-4 z-500 bg-cyan-800 hover:invert-100 text-white p-2 rounded
                    transition-opacity duration-500 ease-in-out
                    ${
                      isOpen
                        ? "opacity-0 pointer-events-none"
                        : "opacity-100 pointer-events-auto"
                    }
                    `}
                aria-label="باز کردن منو"
              >
                <IoMenu size={24} />
              </button>
            </li> */}
            <li className="relative group p-2">
             <h2>سیستم صدور پیش فاکتور</h2>
            </li>
            <li className="relative group p-2">
              <div className="h-full border-l border-l-white w-1 min-h-full">
                {" "}
              </div>
            </li>
            <li className="relative group p-2">
              <Link to="/users/profile" className="text-white">
                <FaUserAlt className="me-1 inline" />
                {user.full_name ?? ""}
                <span className="absolute bottom-0 right-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>

            <li className="relative group p-2">
              <Link to="" onClick={() => dispatch(logout())} className="text-white">
              <FaSignOutAlt size="18"  className="me-1 inline"/>
                خروج
                <span className="absolute bottom-0 right-0 h-0.5 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      {isOpen && (
        <div
          onClick={() => setOpen(false)} // <-- اینجا کلیک روی بک‌دراپ رو هندل کرده
          className="fixed inset-0 bg-transparent bg-opacity-40 z-40"
          aria-hidden="true"
        />
      )}

      {/* منو */}
      {/*md:translate-x-0*/}
      {/* <aside
        className={`
          fixed top-0 right-0 h-full w-64 bg-cyan-50 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <nav className="h-full overflow-y-auto p-4">
          {menuData.map((item, index) => (
            <MenuItem
              key={index}
              item={item}
              closeMenu={() => setOpen(false)}
            />
          ))}
        </nav>
      </aside> */}
    </>
  );
}
