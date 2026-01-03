import React, { useRef, useState, useCallback, useLayoutEffect } from "react";
import clsx from "clsx";

const FileInputField = React.memo(function FileInputField({
  name,
  label,
  rtl = true,
  error,
  accept,
  register,
  validation = {},
  onChange,
  defaultValue = "",
  icon: Icon,
  ...rest
}) {
  //const inputRef = useRef(null);
  const labelRef = useRef(null);

  const [fileName, setFileName] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  //const [labelBox, setLabelBox] = useState({ x: 0, width: 0 });

  //const shouldShowCut = isFocused || fileName !== "";

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      setFileName(file?.name || "");
      onChange?.(e);
    },
    [onChange]
  );

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <div className={clsx("relative rounded-md", error && "mb-6")}>
      {/* آیکون */}
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

      {/* لِیبل شناور */}
      <label
        ref={labelRef}
        htmlFor={`input_${name}`}
        className={clsx(
          "floating-label absolute text-xs text-gray-800 duration-300 transform -translate-y-4 z-10 top-[0.480em] origin-[100] bg-transparent px-1 pointer-events-none select-none",
          "peer-focus:text-cyan-700 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-[0.480em] peer-focus:-translate-y-4",
          "before:content-[''] before:absolute before:top-[60%] before:left-0 before:h-[2px] before:w-full before:bg-[#f5f1ed] before:z-[-1]",
          rtl ? (Icon ? "right-8" : "right-3") : Icon ? "left-8" : "left-3"
        )}
      >
        {label}
      </label>

      {/* کل label که باز کننده پنجره انتخاب فایل */}
      <label
        htmlFor={`input_${name}`}
        className={clsx(
          "flex items-center gap-2 px-3 py-2.5 border rounded-lg bg-[#f5f1ed] cursor-pointer hover:bg-gray-100 select-none",
          error ? "border-red-500" : "border-gray-300",
          rtl ? "justify-start" : "justify-end",
          rtl ? (Icon ? "pr-10" : "pr-3") : Icon ? "pl-10" : "pl-3"
        )}
      >
        {Icon && <Icon size={18} className={rtl ? "ml-2" : "mr-2"} />}
        <span className="text-gray-700 text-sm truncate max-w-[70%]">
          {fileName || "فایلی انتخاب نشده است"}
        </span>
        <span
          className="bg-cyan-600 text-white rounded px-3 py-1 text-xs select-none"
          // اینجا رو دیگه button نذار که رفتار پیش‌فرض نداشته باشه
        >
          انتخاب فایل
        </span>
      </label>

      {/* ورودی فایل مخفی */}
      <input
        id={`input_${name}`}
        {...(register ? register(name, validation) : {})}
        // ref={(e) => {
        //   inputRef.current = e;
        //   if (register) {
        //     register(name, validation).ref(e);
        //   }
        // }}
        type="file"
        name={name}
        accept={accept}
        onChangeCapture={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="hidden peer"
        {...rest}
      />

      {/* خطا */}
      {error && (
        <p className="text-xs text-red-500 mt-1 text-right px-1">{error}</p>
      )}
    </div>
  );
});

export default FileInputField;
