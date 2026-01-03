import { useState, useCallback, useEffect, useEffectEvent } from "react";
import clsx from "clsx";

const formatNumber = (val) => {
  if (val === undefined || val === null) return "";
  const parts = val.toString().split(".");
  let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if (parts.length > 1) {
    return integerPart + "." + parts[1];
  }
  return integerPart;
};

export default function NumericInputField({
  name,
  icon: Icon,
  error,
  rtl = true,
  register,
  validation = {},
  onChange,
  defaultValue = "",
  label,
  onButtonClick,
  buttonIcon: ButtonIcon,
  setFormValue, // برای حالت controlled
  ...rest
}) {
  const [displayValue, setDisplayValue] = useState(formatNumber(defaultValue));

  // فقط اعداد و نقطه اعشاری و کلیدهای خاص
  const onlyDigits = useCallback((e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];
    if (!/^\d$/.test(e.key) && e.key !== "." && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  const handlePaste = useCallback((e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^\d*\.?\d*$/.test(pasted)) {
      e.preventDefault();
    }
  }, []);

  const handleChange = useCallback(
    (e) => {
      const rawValue = e.target.value.replace(/,/g, "");
      if (!/^\d*\.?\d*$/.test(rawValue)) return;

      setDisplayValue(formatNumber(rawValue));

      // اگر setFormValue داده شده → حالت controlled
      if (setFormValue) {
        setFormValue(name, rawValue, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      // ارسال به والد
      onChange?.({ target: { name, value: rawValue } });
    },
    [name, onChange, setFormValue]
  );
  const getRawValue = () => {
    const rawValue = displayValue.replace(/,/g, "");
    if (!/^\d*\.?\d*$/.test(rawValue)) return "";
  };
  const eventDisplayValue = useEffectEvent((value) => {
    setDisplayValue(formatNumber(value));
  });
  // مقدار اولیه هنگام mount
  useEffect(() => {
    if (defaultValue != undefined && defaultValue !== null && setFormValue) {
      setFormValue(name, defaultValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else if (defaultValue != undefined && defaultValue !== null) {
      eventDisplayValue(defaultValue);
    }
  }, [defaultValue, name, setFormValue]);

  return (
    <div className={clsx("relative rounded-md", error ? "mb-6" : "")}>
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

      <input
        type="tel"
        placeholder=" "
        onKeyDown={onlyDigits}
        onPaste={handlePaste}
        onChange={handleChange}
        value={displayValue}
        id={`input_${name}_display`}
        className={clsx(
          "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 rounded-lg border bg-[#f5f1ed] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-600 peer",
          rtl
            ? (Icon ? "pr-10" : "pr-3") + " pl-3 text-right"
            : (Icon ? "pl-10" : "pl-3") + " pr-3 text-left",
          error ? "border-red-500" : "border-gray-300"
        )}
        {...rest}
      />

      {/* ثبت با register اگر داده شده */}
      {register ? (
        <input type="hidden" {...register(name, validation)} />
      ) : (
        <input type="hidden" value={getRawValue() || defaultValue} readOnly />
      )}

      <label
        htmlFor={`input_${name}_display`}
        className={clsx(
          "floating-label absolute text-xs text-gray-800 duration-300 transform -translate-y-4 z-10 top-[7px] origin-[100] bg-transparent px-0.5 peer-focus:px-0.5 pointer-events-none",
          "peer-focus:text-cyan-700 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-600 peer-focus:text-xs peer-focus:top-[7px] peer-focus:-translate-y-4 ",
          "before:content-[''] before:absolute before:top-[8.5px]  before:left-0 before:h-[3px] before:w-full before:bg-[#f5f1ed] before:z-[-1]",
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
    </div>
  );
}
