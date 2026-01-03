import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import moment from "moment-jalaali";
import { fetchIranHolidaysFromOfficialApi } from "../../utils/dateHelper";
import DateObject from "react-date-object";
import transition from "react-element-popper/animations/transition";
import "react-multi-date-picker/styles/layouts/mobile.css";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import clsx from "clsx";
import { FaTimesCircle } from "react-icons/fa";
import useIsMobile from "../../hooks/useIsMobile";
import Button from "../Button";
import { Controller } from "react-hook-form";

moment.loadPersian({ usePersianDigits: false });

const WEEK_DAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

// CustomInput: onFocus رو از DatePicker می‌گیره (forward)، onBlur سفارشی خودمونه
const CustomInput = React.memo(function CustomInput({
  onFocus,
  value,
  onChange,
  onClear,
  onBlur,
  rtl,
  error,
  label,
  labelRef,
  name,
}) {
  return (
    <>
      {value && (
        <div
          className={clsx(
            "absolute top-1/2 -translate-y-1/2 text-gray-400",
            rtl ? "left-3" : "right-3"
          )}
        >
          <FaTimesCircle size={18} onClick={() => onClear()} />
        </div>
      )}
      <input
        id={`input_${name}`}
        placeholder=" "
        onFocusCapture={onFocus} // فوروارد خود DatePicker
        onBlurCapture={onBlur} // فقط state فوکوس خودمون
        value={value}
        onChange={onChange}
        className={clsx(
          "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 rounded-lg border bg-[#f5f1ed] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-600 peer pr-3 pl-3",
          rtl ? " text-right" : " text-left",
          error ? "border-red-500" : "border-gray-300"
        )}
      />
      <label
        ref={labelRef}
        htmlFor={`input_${name}`}
        className={clsx(
          "floating-label absolute text-xs text-gray-800 duration-300 transform -translate-y-4 z-10 top-[7px] origin-[100] bg-transparent px-0.5 peer-focus:px-0.5 pointer-events-none",
          "peer-focus:text-cyan-700 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-600 peer-focus:text-xs peer-focus:top-[7px] peer-focus:-translate-y-4 ",
          "before:content-[''] before:absolute before:top-[8.5px]  before:left-0 before:h-[2px] before:w-full before:bg-[#f5f1ed] before:z-[-1]",
          rtl ? "right-3" : "left-3"
        )}
      >
        {label}
      </label>
    </>
  );
});

function DateTimePicker({
  label = "تاریخ",
  withTime = false,
  value,
  onChange,
  name = "invoiceDate",
  isJalaali = false, // باقی می‌ماند، ولی parsing انعطاف‌پذیر می‌شود
  rtl = true,
  error,
  dark = false,
  range = false,
  minDate,
  maxDate,
  control,
  required,
}) {
  const [dateValue, setDateValue] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [labelBox, setLabelBox] = useState({ x: 0, width: 0 });
  const [holidays, setHolidays] = useState({});
  const labelRef = useRef(null);
  const isMobile = useIsMobile();

  const shouldShowCut = isFocused || dateValue != null;

  const plugins = useMemo(
    () =>
      withTime ? [<TimePicker key="tp" position="bottom" hideSeconds />] : [],
    [withTime]
  );

  const handleFocus = useCallback((focused) => setIsFocused(focused), []);

  const handleChange = useCallback(
    (dateObject) => {
      if (!dateObject) {
        setDateValue(null);
        onChange?.(null);
        return;
      }
      let result;
      if (range) {
        if (dateObject.length > 0) {
          const d0 = dateObject[0]?.toDate();
          const d1 = dateObject[1]?.toDate();
          const m0 = d0 ? moment(d0) : null;
          const m1 = d1 ? moment(d1) : null;
          result = [
            d0 && {
              date: d0,
              iso: m0.format("YYYY-MM-DDTHH:mm:ss"),
              timeStamp: m0.valueOf(),
              jalaali: m0.format("jYYYY/jMM/jDD"),
            },
            d1 && {
              date: d1,
              iso: m1.format("YYYY-MM-DDTHH:mm:ss"),
              timeStamp: m1.valueOf(),
              jalaali: m1.format("jYYYY/jMM/jDD"),
            },
          ].filter(Boolean);
        }
      } else {
        const d = dateObject.toDate();
        const m = moment(d);
        result = {
          date: d,
          jalaali: m.format("jYYYY/jMM/jDD"),
          iso: m.format("YYYY-MM-DDTHH:mm:ss"),
          timestamp: m.valueOf(),
        };
      }
      setDateValue(dateObject);
      onChange?.(result);
    },
    [onChange, range]
  );

  const gotoToday = useCallback(() => {
    const today = new DateObject({ date: new Date(), calendar: persian });
    setDateValue(range ? [today, today] : today);
  }, [range]);

  useLayoutEffect(() => {
    if (shouldShowCut && labelRef.current) {
      const x = labelRef.current.offsetLeft;
      const width = labelRef.current.offsetWidth;
      if (x !== labelBox.x || width !== labelBox.width) {
        setLabelBox({ x, width });
      }
    }
  }, [shouldShowCut, labelBox]);

  useEffect(() => {
    const jYear = moment().format("jYYYY");
    fetchIranHolidaysFromOfficialApi(jYear).then(setHolidays);
  }, []);

  // --- تبدیل ورودی فرم به DateObject (ایمن نسبت به ISO یا جلالی) ---
  useEffect(() => {
    const toGregorian = (val) => {
      if (val == null || val === "") return null;
      if (val instanceof Date) return val;
      if (val?.date) return new Date(val.date);
      if (val?.jalaali) return moment(val.jalaali, "jYYYY/jMM/jDD").toDate();
      if (typeof val === "string") {
        // اول ISO تست شود
        const isoTry = new Date(val);
        if (!isNaN(+isoTry)) return isoTry;
        // اگر ISO نبود، جلالی امتحان شود
        return moment(val, "jYYYY/jMM/jDD").toDate();
      }
      return new Date(val);
    };

    if (range && Array.isArray(value)) {
      const g0 = toGregorian(value[0]);
      const g1 = toGregorian(value[1]);
      if (!g0 && !g1) {
        if (dateValue !== null) setDateValue(null);
        return;
      }
      const d0 = g0 ? new DateObject({ date: g0, calendar: persian }) : null;
      const d1 = g1 ? new DateObject({ date: g1, calendar: persian }) : null;
      const next = [d0, d1].filter(Boolean);
      const same =
        Array.isArray(dateValue) &&
        next.length === dateValue.length &&
        next.every(
          (d, i) => dateValue[i] && +dateValue[i].toDate() === +d.toDate()
        );
      if (!same) setDateValue(next);
    } else if (!range) {
      if (value == null || value === "") {
        if (dateValue !== null) setDateValue(null);
        return;
      }
      const g = toGregorian(value);
      if (!g || isNaN(+g)) return;
      if (!dateValue || +dateValue.toDate() !== +g) {
        setDateValue(new DateObject({ date: g, calendar: persian }));
      }
    }
  }, [value, range]); // عمداً isJalaali وابسته نیست چون parsing انعطاف‌پذیره

  return (
    <div className="relative w-full" dir={rtl ? "rtl" : "ltr"}>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({
          field: { onChange: fieldOnChange },
          formState: { errors },
        }) => (
          <>
            <DatePicker
              // portalTarget={document.body}
              animations={
                withTime ? [] : [transition({ duration: 800, from: 35 })]
              }
              calendar={persian}
              calendarPosition="top-center"
              className={clsx(
                isMobile ? "rmdp-mobile" : "",
                dark ? "bg-dark" : ""
              )}
              containerClassName="w-full"
              dateSeparator="-"
              editable
              format={withTime ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD"}
              id={name}
              locale="persian_fa"
              mapDays={({ date }) => {
                const formatted = date.format("YYYY/MM/DD");
                const isHoliday =
                  holidays[formatted] || date.weekDay.number === 7;
                return isHoliday
                  ? {
                      style: {
                        backgroundColor: "#fff7f0",
                        color: "#d84315",
                        fontWeight: "bold",
                        borderRadius: "6px",
                      },
                      title: holidays[formatted] || "تعطیل",
                    }
                  : {};
              }}
              maxDate={maxDate}
              minDate={minDate}
              mobileLabels={{ OK: "Accept", CANCEL: "انصراف" }}
              months={MONTHS}
              onChange={(v) => {
                // 1) state داخلی
                handleChange(v);

                // 2) مقدار فرم: ISO از خود Date (نه از رشته جلالی)
                const toIso = (dObj) =>
                  dObj ? new Date(dObj.toDate()).toISOString() : null;

                const isoValue = Array.isArray(v) ? v.map(toIso) : toIso(v);

                fieldOnChange(isoValue);
              }}
              plugins={plugins}
              range={range}
              rangeHover
              render={
                <CustomInput
                  onClear={() => {
                    setDateValue(null);
                    fieldOnChange(null);
                  }}
                  // مهم: onFocus رو خود DatePicker تزریق می‌کند؛ ما فقط onBlur برای state خودمون می‌فرستیم
                  onBlur={() => handleFocus(false)}
                  rtl={rtl}
                  error={error}
                  label={label}
                  labelRef={labelRef}
                  name={name}
                />
              }
              value={dateValue || ""}
              weekDays={WEEK_DAYS}
              error={error}
            >
              {!isMobile && (
                <Button
                  onClick={gotoToday}
                  text="امروز"
                  classNames="w-[80%] mb-3 !py-1.5"
                />
              )}
            </DatePicker>

            {errors?.[name]?.type === "required" && (
              <p className="absolute bottom-0 translate-y-4 text-xs text-red-500 text-right">
                {errors[name]?.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}

export default React.memo(DateTimePicker);

// import React, {
//   useEffect,
//   useState,
//   useMemo,
//   useCallback,
//   useRef,
//   useLayoutEffect,
// } from "react";
// import DatePicker from "react-multi-date-picker";
// import TimePicker from "react-multi-date-picker/plugins/time_picker";
// import persian from "react-date-object/calendars/persian";
// import moment from "moment-jalaali";
// import { fetchIranHolidaysFromOfficialApi } from "../../utils/dateHelper";
// import DateObject from "react-date-object";
// import transition from "react-element-popper/animations/transition";
// import "react-multi-date-picker/styles/layouts/mobile.css";
// import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
// import clsx from "clsx";
// import { FaTimesCircle } from "react-icons/fa";
// import useIsMobile from "../../hooks/useIsMobile";
// import Button from "../Button";
// import { Controller } from "react-hook-form";

// moment.loadPersian({ usePersianDigits: false });

// export default function DateTimePicker({
//   label = "تاریخ",
//   withTime = false,
//   value,
//   onChange,
//   name = "invoiceDate",
//   isJalaali = false,
//   rtl = true,
//   error,
//   dark = false,
//   range = false,
//   minDate,
//   maxDate,
//   control,
//   required,
// }) {
//   const [dateValue, setDateValue] = useState(null);
//   const [isFocused, setIsFocused] = useState(false);
//   const [labelBox, setLabelBox] = useState({ x: 0, width: 0 });

//   const shouldShowCut = isFocused || dateValue != null;
//   const [holidays, setHolidays] = useState({});
//   const labelRef = useRef(null);
//   const isMobile = useIsMobile();
//   const weekDays = useMemo(() => ["ش", "ی", "د", "س", "چ", "پ", "ج"], []);
//   const months = useMemo(
//     () => [
//       "فروردین",
//       "اردیبهشت",
//       "خرداد",
//       "تیر",
//       "مرداد",
//       "شهریور",
//       "مهر",
//       "آبان",
//       "آذر",
//       "دی",
//       "بهمن",
//       "اسفند",
//     ],
//     []
//   );

//   const plugins = useMemo(() => {
//     if (withTime)
//       return [<TimePicker key="tp" position="bottom" hideSeconds />];
//     return [];
//   }, [withTime]);
//   const handleChange = useCallback(
//     (dateObject) => {
//       if (!dateObject) {
//         setDateValue(null);
//         onChange?.(null);
//         return;
//       }
//       let result = {};
//       if (range) {
//         if (dateObject.length > 0) {
//           const d0 = dateObject[0].toDate();
//           const m0 = moment(d0);
//           const d1 = dateObject[1]?.toDate();
//           const m1 = d1 ? moment(d1) : undefined;
//           result = [
//             {
//               date: d0,
//               iso: m0.format("YYYY-MM-DDTHH:mm:ss"),
//               timeStamp: m0.valueOf(),
//               jalaali: m0.format("jYYYY/jMM/jDD"),
//             },
//             {
//               date: d1,
//               iso: m1?.format("YYYY-MM-DDTHH:mm:ss"),
//               timeStamp: m1?.valueOf(),
//               jalaali: m1?.format("jYYYY/jMM/jDD"),
//             },
//           ];
//         }
//       } else {
//         const d = dateObject.toDate();
//         const m = moment(d);
//         const jalaali = m.format("jYYYY/jMM/jDD");
//         const iso = m.format("YYYY-MM-DDTHH:mm:ss");
//         const timestamp = m.valueOf();

//         result = { date: d, jalaali, iso, timestamp };
//       }
//       setDateValue(dateObject);
//       onChange?.(result);
//     },
//     [onChange]
//   );
//   const handleFocus = useCallback((focused) => {
//     setIsFocused(focused);
//   });
//   const gotoToday = useCallback(() => {
//     if (range) {
//       setDateValue([
//         new DateObject({ date: new Date(), calendar: persian }),
//         new DateObject({ date: new Date(), calendar: persian }),
//       ]);
//     } else {
//       setDateValue(new DateObject({ date: new Date(), calendar: persian }));
//     }
//   });
//   function CustomInput({ onFocus, value, onChange, onClear }) {
//     return (
//       <>
//         {value && (
//           <div
//             className={clsx(
//               "absolute top-1/2 -translate-y-1/2 text-gray-400",
//               rtl ? "left-3" : "right-3"
//             )}
//           >
//             <FaTimesCircle size={18} onClick={() => onClear()} />
//           </div>
//         )}
//         <input
//           id={`input_${name}`}
//           placeholder=" "
//           onFocusCapture={onFocus}
//           //onFocusCapture={() => handleFocus(true)}
//           onBlurCapture={() => handleFocus(false)}
//           value={value}
//           onChange={onChange}
//           //onChange={(e) => onChange(e?.target?.value)}
//           className={clsx(
//             "block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 rounded-lg border bg-[#f5f1ed] border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-cyan-600 peer pr-3 pl-3",
//             rtl ? " text-right" : " text-left",
//             error ? "border-red-500" : "border-gray-300"
//           )}
//         />
//         <label
//           ref={labelRef}
//           htmlFor={`input_${name}`}
//           className={clsx(
//             "floating-label absolute text-xs text-gray-800 duration-300 transform -translate-y-4 z-10 top-[7px] origin-[100] bg-transparent px-0.5 peer-focus:px-0.5 pointer-events-none",
//             "peer-focus:text-cyan-700 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-600 peer-focus:text-xs peer-focus:top-[7px] peer-focus:-translate-y-4 ",
//             "before:content-[''] before:absolute before:top-[8.5px]  before:left-0 before:h-[2px] before:w-full before:bg-[#f5f1ed] before:z-[-1]",
//             rtl ? "right-3" : "left-3"
//           )}
//         >
//           {label}
//         </label>
//       </>
//     );
//   }
//   useLayoutEffect(() => {
//     if (shouldShowCut && labelRef.current) {
//       const x = labelRef.current.offsetLeft;
//       const width = labelRef.current.offsetWidth;
//       if (x !== labelBox.x || width !== labelBox.width) {
//         setLabelBox({ x, width });
//       }
//     }
//   }, [shouldShowCut]);
//   useEffect(() => {
//     const jYear = moment().format("jYYYY");
//     fetchIranHolidaysFromOfficialApi(jYear).then(setHolidays);
//   }, []);

//   useEffect(() => {
//     if (!value) {
//       setDateValue(null);
//       return;
//     }
//     let gregorianDate = null;

//     if (isJalaali) {
//       if (typeof value === "string") {
//         gregorianDate = moment(value, "jYYYY/jMM/jDD").toDate();
//       } else if (value.jalaali) {
//         gregorianDate = moment(value.jalaali, "jYYYY/jMM/jDD").toDate();
//       } else {
//         gregorianDate = new Date(value.date || value);
//       }
//     } else {
//       gregorianDate = new Date(value.date || value);
//     }

//     if (!dateValue || +dateValue.toDate() !== +gregorianDate) {
//       if (range) {
//         setDateValue([
//           new DateObject({ date: gregorianDate, calendar: persian }),
//           new DateObject({ date: gregorianDate, calendar: persian }),
//         ]);
//       } else {
//         setDateValue(
//           new DateObject({ date: gregorianDate, calendar: persian })
//         );
//       }
//     }
//   }, [value, isJalaali]);

//   return (
//     <div className="relative w-full" dir={rtl ? "rtl" : "ltr"}>
//       <Controller
//         name={name}
//         control={control}
//         rules={{ required: required }}
//         render={({
//           field: { onChange, name, value },
//           fieldState: { invalid, isDirty, error }, //optional
//           formState: { errors },
//         }) => (
//           <>
//             <DatePicker
//               animations={
//                 withTime ? [] : [transition({ duration: 800, from: 35 })]
//               }
//               calendar={persian}
//               calendarPosition="top-center"
//               className={clsx(
//                 isMobile ? "rmdp-mobile" : "",
//                 dark ? "bg-dark" : ""
//               )}
//               containerClassName="w-full"
//               dateSeparator="-"
//               editable
//               format={withTime ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD"}
//               id={name}
//               locale="persian_fa"
//               mapDays={({ date }) => {
//                 const formatted = date.format("YYYY/MM/DD");
//                 const isHoliday =
//                   holidays[formatted] || date.weekDay.number === 7;

//                 if (isHoliday) {
//                   return {
//                     style: {
//                       backgroundColor: "#fff7f0",
//                       color: "#d84315",
//                       fontWeight: "bold",
//                       borderRadius: "6px",
//                     },
//                     title: holidays[formatted] || "تعطیل",
//                   };
//                 }
//                 return {};
//               }}
//               maxDate={maxDate}
//               minDate={minDate}
//               mobileLabels={{
//                 OK: "Accept",
//                 CANCEL: "انصراف",
//               }}
//               months={months}
//               onChange={(v) => {
//                 handleChange(v);

//                 // تبدیل به ISO میلادی برای فرم
//                 const isoValue = Array.isArray(v)
//                   ? v.map((d) =>
//                       moment(d?.toString(), "jYYYY/jMM/jDD").toISOString()
//                     )
//                   : moment(v?.toString(), "jYYYY/jMM/jDD").toISOString();

//                 onChange(isoValue);
//               }}
//               plugins={plugins}
//               range={range}
//               rangeHover
//               render={
//                 <CustomInput
//                   onClear={() => {
//                     setDateValue(null);
//                     onChange(null); // فرم هم خالی بشه
//                   }}
//                 />
//               }
//               value={dateValue || ""}
//               weekDays={weekDays}
//               error={error}
//             >
//               {!isMobile && (
//                 <Button
//                   onClick={gotoToday}
//                   text="امروز"
//                   classNames="w-[80%] mb-3 !py-1.5"
//                 />
//               )}
//             </DatePicker>
//             {errors && errors[name] && errors[name].type === "required" && (
//               //if you want to show an error message

//               <p className="absolute bottom-0 translate-y-4 text-xs text-red-500 text-right">
//                 {errors[name]?.message}
//               </p>
//             )}
//           </>
//         )}
//       />
//     </div>
//   );
// }
