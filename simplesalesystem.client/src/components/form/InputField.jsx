import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";

export default function InputField({
  name,
  type = "text",
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
  dataList,
  ...rest
}) {
  const containerRef = useRef(null);
  const labelRef = useRef(null);

  // مقدار اولیه value از defaultValue ست می‌شود
  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  //const [labelBox, setLabelBox] = useState({ x: 0, width: 0 });

  //const shouldShowCut = isFocused || (value?.toString() ?? "").trim() !== "";

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    // const v = e.target.value;
    // // این شرط کمی پیچیده‌ست ولی میشه ساده‌تر هم کرد اگر لازم باشه
    // if ((v ?? "") !== "" && (value ?? "") === "") {
    //   setValue(v);
    // }
  }, []);

  // فقط اجازه اعداد و کلیدهای خاص در حالت numeric
  const onlyDigits = useCallback((e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Enter",
    ];
    if (
      !/^\d$/.test(e.key) &&
      !allowedKeys.includes(e.key) &&
      e.target.getAttribute("inputmode") === "numeric"
    ) {
      e.preventDefault();
    }
  }, []);

  const handlePaste = useCallback((e) => {
    const pasted = e.clipboardData.getData("text");
    if (e.target.inputmode === "numeric" && !/^\d+$/.test(pasted)) {
      e.preventDefault();
    }
  }, []);

  const handleChange = useCallback(
    (e) => {
      setValue(e.target.value);
      onChange?.(e);
    },
    [onChange]
  );

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  if (type === "hidden") {
    return (
      <input
        type="hidden"
        value={value ?? ""}
        {...(register ? register(name, validation) : {})}
        id={`input_${name}`}
        {...rest}
      />
    );
  }
  return (
    <div
      ref={containerRef}
      className={clsx("relative rounded-md", error ? "mb-6" : "")}
    >
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
        type={type}
        placeholder=" "
        onKeyDown={onlyDigits}
        onPaste={handlePaste}
        onChangeCapture={handleChange}
        onFocus={handleFocus}
        onBlurCapture={handleBlur}
        value={value ?? ""}
        list={`input_${name}_data`}
        //ref={inputRef}
        {...(register ? register(name, validation) : {})}
        id={`input_${name}`}
        {...rest}
        className={clsx(
          "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 rounded-lg border bg-[#f5f1ed] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-600 peer",
          rtl
            ? (Icon ? "pr-10" : "pr-3") + " pl-3 text-right"
            : (Icon ? "pl-10" : "pl-3") + " pr-3 text-left",
          error ? "border-red-500" : "border-gray-300"
        )}
      />
      {Array.isArray(dataList) && (
        <datalist id={`input_${name}_data`}>
          {dataList.map((dl, i) => (
            <option value={dl} key={i}></option>
          ))}
        </datalist>
      )}
      <label
        ref={labelRef}
        htmlFor={`input_${name}`}
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
          <ButtonIcon size={23} />
        </button>
      )}
    </div>
  );
}
