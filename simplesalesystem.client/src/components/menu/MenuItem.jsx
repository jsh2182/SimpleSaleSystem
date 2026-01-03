import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";

export default function MenuItem({ item, depth = 0, closeMenu }) {
  const [open, setOpen] = useState(false);

  if (item.show === false) return null;

  const hasChildren = item.children && item.children.length > 0;

  // padding بر اساس عمق (depth) با حداکثر 12 (48px)
  const paddingLeft = Math.min(depth * 16, 48);

  const handleClick = () => {
    if (item.onClick) {
      item.onClick();
    } else if (hasChildren) {
      setOpen(!open);
    }
  };

  const Icon = item.icon;
  function handleMenuItemClick() {
    item.onClick?.();
    if (!hasChildren) closeMenu?.();
  }
  const renderLabel = (
    <div
      className="flex items-center justify-between w-full py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
      style={{ paddingLeft }}
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        {Icon && <Icon className="text-gray-500" />}
        <span className="text-sm">{item.label}</span>
      </div>
      {hasChildren && (
        <FaChevronDown
          className={`transition-transform duration-200 text-xs ${
            open ? "rotate-180" : ""
          }`}
        />
      )}
    </div>
  );
  return (
    <div className="w-full">
      {item.to ? (
        <NavLink to={item.to} className="block" onClick={handleMenuItemClick}>
          {renderLabel}
        </NavLink>
      ) : (
        renderLabel
      )}

      {hasChildren && open && (
        <div className="ml-2 border-l border-gray-200 pl-2">
          {item.children.map((child, index) => (
            <MenuItem
              key={index}
              item={child}
              depth={depth + 1}
              closeMenu={closeMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}
