import clsx from "clsx";
import { useState, useTransition, useDeferredValue, useCallback, useEffect, useRef } from "react";

export default function SearchableSelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  rtl = true,
  mode = "local", // "local" | "remote"

  remoteSearch,
  remoteData = [],
  remoteLoading = false,
  remoteError,
  remoteHasMore = false,
  remoteNextPage,
  register,
  validation,
  debounceTime = 400,
  ...rest
}) {
  const containerRef = useRef(null); // <--- این اضافه شد
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [isPending, startTransition] = useTransition();
  const deferredQuery = useDeferredValue(query);

  const debounceRef = useRef(null);

  // Debounced search
  const handleSearch = useCallback(
    (val) => {
      setQuery(val);
      if (mode !== "remote" || !remoteSearch) return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
        startTransition(() => {
          remoteSearch(val);
          setPage(1);
        });
      }, debounceTime);
    },
    [remoteSearch, mode, debounceTime]
  );

  // Infinite scroll
  const handleScroll = (e) => {
    if (remoteLoading || !remoteHasMore) return;

    const div = e.target;
    const bottomReached = div.scrollTop + div.clientHeight >= div.scrollHeight - 20;

    if (bottomReached && remoteNextPage) {
      const next = page + 1;
      setPage(next);
      remoteNextPage(deferredQuery, next);
    }
  };

  // Final items
  const finalItems =
    mode === "local"
      ? options.filter((x) =>
          x.label.toLowerCase().includes(deferredQuery.toLowerCase())
        )
      : remoteData.map((x) => ({ value: x.value, label: x.label }));

  const selectedLabel = finalItems.find((x) => x.value === value)?.label || "انتخاب...";

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // cleanup debounce on unmount
  useEffect(() => () => debounceRef.current && clearTimeout(debounceRef.current), []);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hidden input */}
      <input
        type="hidden"
        name={name}
        id={`input_${name}`}
        value={value ?? ""}
        {...(register ? register(name, validation) : {})}
        {...rest}
      />

      {/* Box */}
      <div
        className={clsx(
          "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 rounded-lg border bg-[#f5f1ed] appearance-none cursor-pointer",
          rtl ? "text-right" : "text-left",
          remoteError ? "border-red-500" : "border-gray-300"
        )}
        onClick={() => setIsOpen((x) => !x)}
      >
        {selectedLabel}
      </div>

      {/* Label */}
      {label && (
        <label
          htmlFor={`input_${name}`}
          className={clsx(
            "absolute text-xs text-gray-800 duration-300 transform -translate-y-4 z-10 top-[7px] origin-[100] bg-transparent px-0.5 pointer-events-none",
            rtl ? "right-3" : "left-3",
            "peer-focus:text-cyan-700 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-600 peer-focus:text-xs peer-focus:top-[7px] peer-focus:-translate-y-4",
            "before:content-[''] before:absolute before:top-[8.5px] before:left-0 before:h-[2px] before:w-full before:bg-[#f5f1ed] before:z-[-1]"
          )}
        >
          {label}
        </label>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 bg-[#f5f1ed] border border-gray-300 rounded mt-1 z-50 max-h-72 overflow-auto shadow scroll-thin"
          onScroll={mode === "remote" ? handleScroll : undefined}
        >
          {/* Search box */}
          <input
            className="w-full px-3 py-2 border-b border-gray-300 outline-none"
            placeholder="جستجو..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
          />

          {/* Loading */}
          {(remoteLoading || isPending) && (
            <div className="p-3 text-center text-gray-500">در حال بارگذاری...</div>
          )}

          {/* Error */}
          {remoteError && (
            <div className="p-3 text-center text-red-500">خطا در دریافت اطلاعات</div>
          )}

          {/* Items */}
          {finalItems.map((item) => (
            <div
              key={item.value}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                onChange?.(item.value);
                setIsOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}

          {/* No Result */}
          {!remoteLoading && finalItems.length === 0 && (
            <div className="p-3 text-center text-gray-400 text-sm">نتیجه‌ای یافت نشد</div>
          )}

          {/* Infinite scroll loading */}
          {remoteHasMore && !remoteError && (
            <div className="p-2 text-center text-gray-400 text-xs">در حال بارگذاری بیشتر...</div>
          )}
        </div>
      )}
    </div>
  );
}
