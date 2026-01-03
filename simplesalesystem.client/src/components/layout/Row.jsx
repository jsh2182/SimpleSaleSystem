import React from "react";
import clsx from "clsx";

/**
 * Row component with flex/grid support and flexible gap, alignment, justify
 */
export default function Row({
  children,
  mode = "grid",
  gap = "",
  justify = "",
  align = "",
  wrap = "wrap",
  className = "",
}) {
  const gapClass = clsx({
    "gap-0": gap === "0",
    "gap-1": gap === "1",
    "gap-2": gap === "2",
    "gap-4": gap === "4",
    "gap-6": gap === "6",
    "gap-x-2": gap === "x-2",
    "gap-x-4": gap === "x-4",
    "gap-y-2": gap === "y-2",
    "gap-x-6": gap === "x-6",
    "gap-y-4": gap === "y-4",
  });

  const baseClass =
    mode === "grid"
      ? "grid grid-cols-12"
      : clsx("flex", wrap === "wrap" ? "flex-wrap" : "flex-nowrap");

  const justifyClass = justify ? `justify-${justify}` : "";
  const alignClass = align ? `items-${align}` : "";

  return (
    <div
      className={clsx(baseClass, gapClass, justifyClass, alignClass, className)}
    >
      {children}
    </div>
  );
}
