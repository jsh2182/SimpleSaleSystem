import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import clsx from "clsx";
import { toPersianNumberIfPersianText } from "../../utils/stringHelper";
export default function SelectField({
  name,
  icon: Icon,
  options = [],
  error,
  rtl = true,
  register,
  validation = {},
  onChange,
  defaultValue = "",
  label,
  displayName = "label",
  valueName = "value",
  classNames,
  hasEmptyOption,
  ...rest
}) {
  const containerRef = useRef(null);
  const labelRef = useRef(null);
  const selectRef = useRef(null);

  const [value, setValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);
  const [labelBox, setLabelBox] = useState({ x: 0, width: 0 });

  const shouldShowCut = isFocused || (value?.toString() ?? "").trim() !== "";

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleChange = useCallback(
    (e) => {
      setValue(e.target.value);
      onChange?.(e);
    },
    [onChange]
  );

  useLayoutEffect(() => {
    if (shouldShowCut && labelRef.current) {
      const x = labelRef.current.offsetLeft;
      const width = labelRef.current.offsetWidth;
      if (x !== labelBox.x || width !== labelBox.width) {
        setLabelBox({ x, width });
      }
    }
  }, [shouldShowCut]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div
      ref={containerRef}
      className={clsx("relative rounded-md", error ? "mb-6" : "")}
    >
      {/* {shouldShowCut && label && (
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
      )} */}

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

      <select
        id={`select_${name}`}
        placeholder=" "
        ref={selectRef}
        value={value}
        onFocusCapture={handleFocus}
        onBlurCapture={handleBlur}
        onChangeCapture={handleChange}
        {...(register ? register(name, validation) : {})}
        {...rest}
        className={clsx(
          "custom-scrollbar block px-2.5 pb-2.5 w-full text-sm text-gray-900 rounded-lg border bg-[#f5f1ed] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-600 peer",
          rtl
            ? (Icon ? "pr-10" : "pr-3") + " pl-3 text-right"
            : (Icon ? "pl-10" : "pl-3") + " pr-3 text-left",
          label ? "pt-4" : "pt-2",
          error ? "border-red-500" : "border-gray-300",
          classNames
        )}
      >
       {hasEmptyOption && <option value=""></option>}
        {Array.isArray(options) &&
          options.map((opt) =>
            typeof opt === "object" ? (
              <option key={opt[valueName]} value={opt[valueName]}>
                {toPersianNumberIfPersianText(opt[displayName])}
              </option>
            ) : (
              <option key={opt} value={opt}>
                {toPersianNumberIfPersianText(opt)}
              </option>
            )
          )}
      </select>
      {label && (
        <label
          ref={labelRef}
          htmlFor={`select_${name}`}
          className={clsx(
            "floating-label absolute text-sm text-gray-700 duration-300 transform z-10 bg-transparent px-0.5 origin-[100] pointer-events-none",
            rtl ? (Icon ? "right-8" : "right-3") : Icon ? "left-8" : "left-3",
            "before:content-[''] before:absolute   before:left-0 before:h-[3px] before:w-full before:bg-[#f5f1ed] before:z-[-1]",
            shouldShowCut
              ? "-translate-y-4 text-cyan-700 text-xs top-[7px] before:top-[8.5px]"
              : `-translate-y-1/2 top-1/2 before:top-1/2`
          )}
        >
          {label + (shouldShowCut ? "" : " را انتخاب کنید")}
        </label>
      )}

      {error && (
        <p className="absolute bottom-0 translate-y-4 text-xs text-red-500 text-right">
          {error}
        </p>
      )}
    </div>
  );
}
