import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import Row from "../layout/Row";
import Col from "../layout/Col";
import InputField from "./InputField";
import DateTimePicker from "./DateTimePicker";
import SelectField from "./SelectField";
import MultiSelect from "./MultiSelect";
import CheckboxField from "./CheckboxField";
import Button from "../Button";
import FileInputField from "./FileInputField";
import clsx from "clsx";
import NumericInputField from "./NumericInputField";
import RadioField from "./RadioField";

export default function SubmitForm({
  fields = [],
  onSubmit,
  onAfterSubmit,
  extraButtons = [],
  formTitle = "",
  defaultValues = {},
  rtl = "true",
  submitIcon,
  submitFormData = false,
  submitText,
  isPartial = false,
}) {
  // چک کردن نام‌های تکراری در فیلدها
  const duplicateNames = useMemo(() => {
    const names = fields.map((f) => f.name);
    const duplicates = names.filter((name, idx) => names.indexOf(name) !== idx);
    return [...new Set(duplicates)];
  }, [fields]);

  if (duplicateNames.length > 0) {
    return (
      <div style={{ color: "red", padding: 16, border: "1px solid red" }}>
        خطا: نام فیلدهای زیر تکراری هستند: {duplicateNames.join(", ")}. لطفاً
        آنها را یکتا کنید.
      </div>
    );
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm(); //{ defaultValues }
  const submitHandler = async (data) => {
    try {
      if (submitFormData) {
        data = toFormData(data);
      }
      await onSubmit(data);
      if (onAfterSubmit) onAfterSubmit();
    } catch (error) {
      console.error(error);
    }
  };

  const parseLen = (len) => {
    if (!len) return {};
    const responsive = {};
    len.split(",").forEach((item) => {
      const [key, val] = item.split(":");
      if (key && val) {
        responsive[key.trim()] = Number(val.trim());
      }
    });
    return { responsive };
  };

  const renderField = (field) => {
    //validation in field props is a function like: (val, formValues) =>  val === formValues.password || "تکرار رمز با رمز مطابقت ندارد"
    const {
      name,
      title,
      type,
      required,
      validation,
      len,
      options,
      maxlength,
      min,
      max,
      icon,
      placeholder,
      onChange,
      pattern,
      patternMessage,
      displayName, //برای فیلد Select
      valueName, //برای فیلد Select
      accept, //برای فیلد فایل
      isJalaali, //برای فیلد تاریخ
      buttonIcon, // برای input هایی که دکمه انتخاب دارند
      onButtonClick,
      parentClassName,
      onKeyDown,
      readOnly
    } = field;
    const colProps = { ...parseLen(len), className: parentClassName };
    const validationRules = {
      validate: validation ?? {},
      required: required || false,
    };

    if (type === "text" && maxlength) {
      validationRules.maxLength = {
        value: maxlength,
        message: `حداکثر طول مجاز ${maxlength} کاراکتر است.`,
      };
    }
    if (pattern) {
      validationRules.pattern = {
        value: pattern,
        message: patternMessage || "الگوی وارد شده نادرست است.",
      };
    }
    if (type === "number") {
      if (min !== undefined) {
        validationRules.min = {
          value: min,
          message: `حداقل مقدار باید ${min} باشد.`,
        };
      }
      if (max !== undefined) {
        validationRules.max = {
          value: max,
          message: `حداکثر مقدار باید ${max} باشد.`,
        };
      }
    }

    const commonProps = {
      // id: name,
      name: name,
      rtl: rtl,
      onChange,
      onKeyDown,
      readOnly,
      label: title,
      placeholder: placeholder??" ",
      icon: icon,
      error: errors[name]?.message,
      register: register,
      validation: validationRules,
    };

    switch (type) {
      case "hidden":
        return (
          <InputField
            key={name}
            type="hidden"
            {...commonProps}
            defaultValue={getCaseInsensitive(name)}
          />
        );
      case "text":
        return (
          <Col key={name} {...colProps}>
            <InputField
              {...commonProps}
              maxLength={maxlength}
              type="text"
              defaultValue={getCaseInsensitive(name)}
            />
          </Col>
        );
      case "password":
        return (
          <Col key={name} {...colProps}>
            <InputField
              {...commonProps}
              maxLength={maxlength}
              type="password"
              defaultValue={getCaseInsensitive(name)}
            />
          </Col>
        );
      case "text_button":
        return (
          <Col key={name} {...colProps}>
            <InputField
              {...commonProps}
              maxLength={maxlength}
              type="text"
              defaultValue={getCaseInsensitive(name)}
              onButtonClick={onButtonClick}
              buttonIcon={buttonIcon}
            />
          </Col>
        );
      case "number":
        return (
          <Col key={name} {...colProps}>
            <InputField
              type="text"
              {...commonProps}
              inputMode="numeric"
              min={min}
              max={max}
              defaultValue={getCaseInsensitive(name)}
            />
          </Col>
        );
      case "currency":
        return (
          <Col key={name} {...colProps}>
            <NumericInputField
              {...commonProps}
              min={min}
              max={max}
              setFormValue={setValue}
              defaultValue={getCaseInsensitive(name)}
            />
          </Col>
        );

      case "date":
        return (
          <Col key={name} {...colProps}>
            <DateTimePicker
              required={required}
              {...commonProps}
              isJalaali={isJalaali}
              value={getCaseInsensitive(name)}
              control={control}
            />
          </Col>
        );

      case "check":
        return (
          <Col key={name} {...colProps}>
            <CheckboxField
              {...commonProps}
              defaultChecked={
                getCaseInsensitive(name)?.toString()?.toLowerCase() === "true"
              }
            />
          </Col>
        );
      case "radio":
        return (
          <Col key={name} {...colProps}>
            <RadioField
              {...commonProps}
              defaultChecked={
                getCaseInsensitive(name)?.toString()?.toLowerCase() === "true"
              }
            />
          </Col>
        );
      case "select":
        return (
          <Col key={name} {...colProps}>
            <SelectField
              {...commonProps}
              options={options || []}
              displayName={displayName}
              valueName={valueName}
              defaultValue={getCaseInsensitive(name)}
            />
          </Col>
        );

      case "multiselect":
        return (
          <Col key={name} {...colProps}>
            <MultiSelect {...commonProps} options={options || []} />
          </Col>
        );
      case "file":
        return (
          <Col key={name} {...colProps}>
            <FileInputField
              {...commonProps}
              accept={accept || "*"} //".pdf,.jpg,.jpeg,.png"
              onChange={onChange}
            />
          </Col>
        );

      default:
        return null;
    }
  };
  const toFormData = useCallback((data) => {
    const formData = new FormData();

    for (const key in data) {
      if (data[key] instanceof FileList && data[key]?.length > 0) {
        formData.append(key, data[key][0]);
      } else {
        formData.append(key, data[key]);
      }
    }
    return formData;
  }, []);
  function getCaseInsensitive(key) {
    key = key.toLowerCase(); // کلید ورودی رو کوچیک می‌کنیم
    for (let k in defaultValues) {
      if (k.toLowerCase() === key) {
        return defaultValues[k]; // پیدا شد
      }
    }
    return undefined; // پیدا نشد
  }
  return (
    <div
      className={clsx(
        !isPartial &&
          "min-h-screen bg-linear-[180deg] from-[#c5e6eb] to-white flex flex-col z-0"
      )}
    >
      <main
        className={clsx(
          !isPartial && "flex-1 flex justify-center items-center px-4 py-8"
        )}
      >
        <form
          encType="multipart/form-data"
          onSubmit={handleSubmit(submitHandler)}
          className={clsx(
            "w-full ",
            !isPartial &&
              " bg-[#00000004] p-8 rounded-lg outline-1 outline-blue-50 shadow-md"
          )}
        >
          {formTitle && (
            <h2 className="mb-5 border-b-1 border-cyan-700 pb-2">
              {formTitle}
            </h2>
          )}
          <Row mode="flex">{fields.map((field) => renderField(field))}</Row>

          <div className="w-full" style={{ marginTop: 16 }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              icon={submitIcon}
              text={submitText || "ثبت اطلاعات"}
              classNames="me-2 "
              color="success"
            ></Button>
            {extraButtons.map((btnProps, i) => (
              <Button key={i} type="button" {...btnProps}></Button>
            ))}
          </div>
        </form>
      </main>
    </div>
  );
}
