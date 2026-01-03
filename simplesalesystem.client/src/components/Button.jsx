import clsx from "clsx";
import { MoonLoader } from "react-spinners";
import { isValidElement } from "react";

// --- 🎨 رنگ پس‌زمینه دکمه (با حالت‌های hover و dark)
export const buttonBgVariants = {
  white: {
    base: "bg-white",
    hover: "hover:bg-gray-100",
    ring: "focus:ring-gray-200",
    darkHover: "dark:hover:bg-gray-100",
    darkRing: "dark:focus:ring-gray-300",
  },
  gray: {
    base: "bg-gray-500",
    hover: "hover:bg-gray-600",
    ring: "focus:ring-gray-300",
    darkHover: "dark:hover:bg-gray-600",
    darkRing: "dark:focus:ring-gray-400",
  },
  FF9119: {
    base: "bg-[#FF9119]",
    hover: "hover:bg-[#FF9119]/80",
    ring: "focus:ring-[#FF9119]/50",
    darkHover: "dark:hover:bg-[#FF9119]/80",
    darkRing: "dark:focus:ring-[#FF9119]/40",
  },
  F7BE38: {
    base: "bg-[#F7BE38]",
    hover: "hover:bg-[#F7BE38]/80",
    ring: "focus:ring-[#F7BE38]/50",
    darkHover: "dark:hover:bg-[#F7BE38]/80",
    darkRing: "dark:focus:ring-[#F7BE38]/40",
  },
  N50708: {
    base: "bg-[#050708]",
    hover: "hover:bg-[#050708]/80",
    ring: "focus:ring-[#050708]/50",
    darkHover: "dark:hover:bg-[#050708]/80",
    darkRing: "dark:focus:ring-[#050708]/40",
  },
  primary: {
    base: "bg-[#2557D6]",
    hover: "hover:bg-[#2557D6]/80",
    ring: "focus:ring-[#2557D6]/50",
    darkHover: "dark:hover:bg-[#2557D6]/80",
    darkRing: "dark:focus:ring-[#2557D6]/40",
  },
  success: {
    base: "bg-[#29968b]",
    hover: "hover:bg-[#29968b]/80",
    ring: "focus:ring-[#29968b]/50",
    darkHover: "dark:hover:bg-[#29968b]/80",
    darkRing: "dark:focus:ring-[#29968b]/40",
  },
  danger: {
    base: "bg-[#a8323c]",
    hover: "hover:bg-[#a8323c]/80",
    ring: "focus:ring-[#a8323c]/50",
    darkHover: "dark:hover:bg-[#a8323c]/80",
    darkRing: "dark:focus:ring-[#a8323c]/40",
  },
};

// --- ✍️ رنگ متن
export const textColorVariants = {
  white: "text-white",
  black: "text-black",
  gray: "text-gray-800",
  lightGray: "text-gray-300",
  blue: "text-blue-600",
};

// --- 📏 اندازه‌ها
export const sizeVariants = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-6 py-3",
};

// --- نوع دکمه
export const btnTypes = {
  button: "button",
  submit: "submit",
};

// --- خود کامپوننت
export default function Button({
  icon: Icon,
  text = "",
  color = "N2557D6",
  textColor = "white",
  size = "md",
  variant = "filled", // "filled" | "outline" | "ghost"
  type = "button",
  classNames = "",
  isLoading = false,
  disabled = false,
  fullWidth = false,
  children,
  ...rest
}) {
  const bg = buttonBgVariants[color] || buttonBgVariants.primary;
  const txt = textColorVariants[textColor] || textColorVariants.white;
  const sizeClass = sizeVariants[size] || sizeVariants.md;

  const baseClasses = [
    "inline-flex items-center justify-center",
    "rounded-lg font-medium text-center",
    "focus:outline-none focus:ring-4 transition-colors duration-200",
    sizeClass,
    fullWidth && "w-full",
    classNames,
  ];

  let variantClasses = [];

  if (variant === "filled") {
    variantClasses = [
      txt,
      bg.base,
      bg.hover,
      bg.ring,
      bg.darkHover,
      bg.darkRing,
    ];
  } else if (variant === "outline") {
    variantClasses = [
      "border",
      txt,
      "border-current",
      "bg-transparent",
      "hover:bg-opacity-10",
      "dark:hover:bg-opacity-10",
    ];
  } else if (variant === "ghost") {
    variantClasses = [
      txt,
      "bg-transparent",
      "hover:bg-gray-100",
      "dark:hover:bg-gray-800",
    ];
  }

  const isDisabled = disabled || isLoading;
  const override = {
    margin: "0",
  };
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={clsx(
        ...baseClasses,
        ...variantClasses,
        isDisabled && "opacity-50 cursor-not-allowed"
      )}
      {...rest}
    >
      {Icon && (
        <span
          className={clsx("relative w-4 h-4 flex items-center justify-center overflow-hidden ", text?.length >0 ?"me-2":"")}
          style={{ minWidth: "16px", minHeight: "16px" }}
        >
          {isLoading ? (
            <MoonLoader
              color={textColor}
              size={14}
              cssOverride={{
                lineHeight: "1",
                margin: 0,
                padding: 0,
              }}
            />
          ) : Icon ? (
            isValidElement(Icon) ? (
              Icon
            ) : (
              <Icon className="w-4 h-4" />
            )
          ) : null}
        </span>
      )}
      {text}
      {children}
    </button>
  );
}
