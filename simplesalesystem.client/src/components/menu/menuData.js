// menuData.js
import {
  FaHome,
  FaUserCog,
  FaBoxOpen,
  FaChartBar,
  FaStore,
  FaPlus,
  FaAddressCard,
} from "react-icons/fa";
import { HiWrenchScrewdriver } from "react-icons/hi2";
import { BiSearchAlt2, BiPlus, BiUserPlus, BiListUl, BiFileBlank } from "react-icons/bi";

export const menuData = [
  {
    label: "صفحه اصلی",
    icon: FaHome, // دقت کن که اینجا فقط کامپوننت آیکون هست، نه JSX
    to: "/Dashboard",
    show: true,
  },
  {
    label: "کاربران",
    icon: FaUserCog,
    show: true,
    children: [
      { label: "کاربر جدید", icon: BiUserPlus, to: "/users/new", show: true },
      {
        label: "فهرست کاربران",
        icon: BiListUl,
        to: "/users/list",
        show: true,
      },
    ],
  },
  {
    label: "مشتریان",
    icon: FaAddressCard,
    show: true,
    children: [
      { label: "مشتری جدید", icon: BiUserPlus, to: "/customers/new", show: true },
      {
        label: "فهرست مشتریان",
        icon: BiListUl,
        to: "/customers/new",
        show: true,
      },
    ],
  },  
  {
    label: "محصولات",
    icon: FaBoxOpen,
    show: true,
    children: [
      {
        label: "محصول جدید",
        icon: BiPlus,
        to: "/products/new",
        show: true,
      },
      {
        label: "فهرست محصولات",
        icon:BiListUl,
        to: "/products/list",
        show: true,
      },
    ],
  },
  {
    label: "فروش",
    icon: FaStore,
    show: true,
    children: [
      {label:"فاکتور جدید", icon:BiFileBlank, to:"sale/new", show:true},
      {
        label: "جستجوی فاکتورها",
        icon: BiSearchAlt2,
        to: "/sale/search",
        show: true,
      },
    ],
  },
  {
    label: "گزارشات",
    icon: FaChartBar,
    show: false, // غیرفعال به دلیل دسترسی کاربر
  },
];
