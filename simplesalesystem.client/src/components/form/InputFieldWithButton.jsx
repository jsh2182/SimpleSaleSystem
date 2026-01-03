// components/InputFieldWithButton.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";

export default function InputFieldWithButton({
  name,
  type = "text",
  icon: Icon,
  buttonIcon: ButtonIcon,
  onButtonClick,
  placeholder,
  error,
  rtl = true,
  register,
  validation = {},
  onChange,
  defaultValue = "",
  value: propValue,
  readOnly = false,
  label,
  ...rest
}) {
  const containerRef = useRef(null);
  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  const handleChange = useCallback(
    (e) => {
      setValue(e.target.value);
      onChange?.(e);
    },
    [onChange]
  );

  useEffect(() => {
    if (propValue !== undefined) {
      setValue(propValue);
    }
  }, [propValue]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div
      ref={containerRef}
      className={clsx("relative rounded-md", error ? "mb-6" : "")}
    >
      {/* آیکن اصلی */}
      {Icon && (
        <div
          className={clsx(
            "absolute top-1/2 -translate-y-1/2 text-gray-400",
            rtl ? "right-3" : "left-3"
          )}
        >
          <Icon size={18} />
        </div>
      )}

      {/* دکمه داخلی */}
      {ButtonIcon && (
        <button
          type="button"
          onClick={onButtonClick}
          className={clsx(
            "absolute top-1/2 -translate-y-1/2 text-cyan-600 hover:text-cyan-800 focus:outline-none",
            rtl ? "left-3" : "right-3"
          )}
        >
          <ButtonIcon size={18} />
        </button>
      )}

      <input
        type={type}
        placeholder=" "
        onChangeCapture={handleChange}
        onFocus={handleFocus}
        onBlurCapture={handleBlur}
        value={value ?? ""}
        readOnly={readOnly}
        id={`input_${name}`}
        {...(register ? register(name, validation) : {})}
        {...rest}
        className={clsx(
          "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 rounded-lg border bg-[#f5f1ed] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-600 peer",
          rtl
            ? (Icon ? "pr-10" : "pr-3") +
                (ButtonIcon ? " pl-10" : " pl-3") +
                " text-right"
            : (Icon ? "pl-10" : "pl-3") +
                (ButtonIcon ? " pr-10" : " pr-3") +
                " text-left",
          error ? "border-red-500" : "border-gray-300"
        )}
      />

      <label
        htmlFor={`input_${name}`}
        className={clsx(
          "absolute text-xs text-gray-800 duration-300 transform -translate-y-4 z-10 top-[0.480em] origin-[100] bg-transparent px-0.5 pointer-events-none",
          "peer-focus:text-cyan-700 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-600 peer-focus:text-xs peer-focus:top-[0.480em] peer-focus:-translate-y-4",
          rtl ? (Icon ? "right-8" : "right-3") : Icon ? "left-8" : "left-3"
        )}
      >
        {label}
      </label>

      {error && (
        <p className="absolute bottom-0 translate-y-4 text-xs text-red-500 text-right">
          {error}
        </p>
      )}
    </div>
  );
}
