import clsx from "clsx";

export default function Col({
  span = 12,
  responsive = {},
  offset = {},
  order = {},
  className,
  children,
}) {
  const baseClass = `col-${span}`;

  const responsiveClasses = responsive
    ? Object.entries(responsive).map(
        ([breakpoint, val]) => `${breakpoint}:col-${val}`
      )
    : [];

  const offsetClasses = offset
    ? Object.entries(offset).map(
        ([breakpoint, val]) => `${breakpoint}:offset-${val}`
      )
    : [];

  const orderClasses = order
    ? Object.entries(order).map(
        ([breakpoint, val]) => `${breakpoint}:order-${val}`
      )
    : [];

  return (
    <div
      className={clsx(
        "p-2",
        baseClass,
        ...responsiveClasses,
        ...offsetClasses,
        ...orderClasses,
        className
      )}
    >
      {children}
    </div>
  );
}
