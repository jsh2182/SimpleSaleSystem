import { useState, useRef, useEffect, useLayoutEffect } from "react";
import clsx from "clsx";
import useIsMobile from "../../hooks/useIsMobile";
import { FiCheck } from "react-icons/fi";

export default function MultiSelectField({
  name,
  label,
  options = [],
  value,
  onChange,
  icon: Icon,
  showSelectAll = true,
  register,
  error,
  rtl = true,
}) {
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef(null);
  const labelRef = useRef(null);

  const isControlled =
    typeof value !== "undefined" && typeof onChange === "function";
  const [internalValue, setInternalValue] = useState([]);

  const currentValue = isControlled ? value : internalValue;
  const setValue = isControlled ? onChange : setInternalValue;

  const [labelBox, setLabelBox] = useState({ x: 0, width: 0 });

  const shouldShowCut = open || currentValue.length > 0;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val) => {
    if (currentValue.includes(val)) {
      setValue(currentValue.filter((v) => v !== val));
    } else {
      setValue([...currentValue, val]);
    }
  };

  const removeOption = (val) => {
    setValue(currentValue.filter((v) => v !== val));
  };

  const allSelected = currentValue.length === options.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setValue([]);
    } else {
      setValue(options.map((o) => o.value));
    }
  };
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300); // مدت زمان انیمیشن slide-down
  };
  const selectedLabels = options
    .filter((opt) => currentValue.includes(opt.value))
    .map((opt) => opt.label);

  useLayoutEffect(() => {
    if (shouldShowCut && labelRef.current) {
      const x = labelRef.current.offsetLeft;
      const width = labelRef.current.offsetWidth;
      if (x !== labelBox.x || width !== labelBox.width) {
        setLabelBox({ x, width });
      }
    }
  }, [shouldShowCut]);

  return (
    <div
      ref={containerRef}
      className={clsx("relative rounded-md", error ? "mb-6" : "")}
    >
      {shouldShowCut && (
        <div
          className={clsx(
            "absolute z-10 top-0 h-0.5 px-1 bg-[#f5f1ed] pointer-events-none",
            rtl
              ? (Icon ? "pr-10" : "pr-3") + " pl-3 text-right"
              : (Icon ? "pl-10" : "pl-3") + " pr-3 text-left"
          )}
          style={{
            left: labelBox.x,
            width: labelBox.width,
          }}
        />
      )}

      {register && (
        <input
          type="hidden"
          name={name}
          value={JSON.stringify(currentValue)}
          {...register(name)}
        />
      )}

      <div
        className={clsx(
          "px-2.5 pb-2.5 pt-2.5 w-full text-sm rounded-lg border appearance-none bg-[#f5f1ed] focus:outline-none focus:ring-0 peer cursor-pointer min-h-[42px] flex flex-wrap gap-2 transition-all duration-300",
          error
            ? "border-red-500"
            : shouldShowCut
            ? "border-cyan-600"
            : "border-gray-300"
        )}
        onClick={() => setOpen(!open)}
      >
        {selectedLabels.length > 0
          ? selectedLabels.map((label, i) => (
              <span
                key={i}
                className="bg-blue-100 text-cyan-700 px-2 py-0.5 text-sm rounded flex items-center gap-1 animate-[fadeIn_0.2s_ease-in-out]"
                onClick={(e) => {
                  e.stopPropagation();
                  const val = options.find((o) => o.label === label)?.value;
                  removeOption(val);
                }}
              >
                {label}
                <span className="cursor-pointer text-xs">&times;</span>
              </span>
            ))
          : null}
      </div>

      <label
        ref={labelRef}
        className={clsx(
          "floating-label absolute text-xs text-gray-700 duration-300 transform z-10 bg-transparent px-0.5 top-2 origin-[100] pointer-events-none",
          rtl ? (Icon ? "right-8" : "right-3") : Icon ? "left-8" : "left-3",
          shouldShowCut
            ? "-translate-y-5 text-cyan-700"
            : `translate-y-1/2 top-0`
        )}
      >
        {label}
      </label>

      {error && (
        <p className="text-sm text-red-600 mt-1 text-right">{error.message}</p>
      )}

      {(open || isClosing) && isMobile ? (
        <div
          className={clsx(
            "fixed z-50 bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-auto p-4 border-t border-gray-200",
            isClosing ? "animate-slide-down" : "animate-slide-up"
          )}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">انتخاب {label}</h3>
            <button
              type="button"
              onClick={handleClose}
              className="text-sm text-blue-500"
            >
              بستن
            </button>
          </div>
          {showSelectAll && (
            <div
              className="px-3 py-2 font-medium bg-gray-200 hover:bg-gray-300 cursor-pointer rounded mb-2"
              onClick={handleSelectAll}
            >
              {allSelected ? "حذف همه" : "انتخاب همه"}
            </div>
          )}
          <div className="space-y-1">
            {options.map((opt) => {
              const selected = currentValue.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => toggleOption(opt.value)}
                  className={clsx(
                    "px-4 py-3 rounded-lg cursor-pointer transition-all select-none flex items-center gap-3",
                    selected
                      ? "bg-blue-200 text-blue-900 shadow-md font-semibold"
                      : "bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-800"
                  )}
                >
                  {selected && (
                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-cyan-600 text-white select-none">
                      ✓
                    </div>
                  )}
                  <span>{opt.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleClose}
              className={`bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg
                  flex items-center justify-center gap-2 text-sm transition-all w-full
                  shadow hover:shadow-md active:scale-[0.98]`}
            >
              <FiCheck className="w-4 h-4" />
              <span>تأیید</span>
            </button>
          </div>
        </div>
      ) : (
        open && (
          <ul
            className={clsx(
              "absolute z-50 mt-1 w-full bg-white border border-cyan-600 rounded shadow max-h-60 overflow-auto text-sm space-y-0.5",
              rtl ? "text-right" : "text-left"
            )}
          >
            {showSelectAll && (
              <li
                className="px-3 py-2 font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer sticky top-0"
                onClick={handleSelectAll}
              >
                {allSelected ? "حذف همه" : "انتخاب همه"}
              </li>
            )}
            {options.map((opt) => {
              const selected = currentValue.includes(opt.value);
              return (
                <li
                  key={opt.value}
                  className={clsx(
                    "px-3 py-2 cursor-pointer transition-colors",
                    selected
                      ? "bg-blue-100 text-cyan-800 font-semibold"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                  onClick={() => toggleOption(opt.value)}
                >
                  <div className="flex items-center gap-2">
                    {selected && (
                      <div className="w-4 h-4 flex items-center justify-center rounded-full bg-cyan-600 text-white select-none text-xs">
                        ✓
                      </div>
                    )}
                    <span>{opt.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )
      )}
    </div>
  );
}
