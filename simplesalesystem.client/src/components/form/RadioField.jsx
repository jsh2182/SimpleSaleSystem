import React from "react";

const RadioField = ({
  id,
  name,
  label,
  register,
  validation,
  error,
  classNames,
  ...rest
}) => {
  const inputName = name || id;

  return (
    <div className="flex flex-col space-y-1 h-full">
      <div className="relative flex items-center gap-2 rtl:gap-2 h-full">
        <input
          type="radio"
          id={`chk_${inputName}`}
          name={inputName}
          {...(register ? register(inputName, validation) : {})}
          {...rest}
          className={`h-4 w-4 border rounded-sm accent-cyan-700
                      checked:border-cyan-700
                      transition-all duration-100 ease-in-out bg-white
                      outline-transparent
                      focus:outline-solid focus:outline-emerald-600 focus:outline-2 focus:outline-offset-2 focus:outline-
                      ${
                        error ? "border-red-500" : "border-gray-400"
                      } ${classNames}`}
        />

        <label
          htmlFor={`chk_${inputName}`}
          className="text-sm text-gray-800 cursor-pointer select-none ps-1 text-right"
        >
          {label}
        </label>
      </div>

      {error && (
        <span className="text-sm text-red-600 ps-6">{error.message}</span>
      )}
    </div>
  );
};

export default RadioField;
