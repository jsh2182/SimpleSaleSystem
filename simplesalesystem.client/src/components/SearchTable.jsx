import React, {
  useMemo,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffectEvent,
} from "react";
import { useSelector } from "react-redux";
import useIsMobile from "../hooks/useIsMobile";
import {
  FaAngleDoubleRight,
  FaAngleRight,
  FaAngleLeft,
  FaAngleDoubleLeft,
  FaSortUp,
  FaSortDown,
  FaRegFileExcel,
} from "react-icons/fa";
import { MdPrint } from "react-icons/md";
import clsx from "clsx";
// import OverlayScrollbar from "./OverlayScrollbar";
import Modal from "./Modal";
import Button from "./Button";

import SelectField from "./form/SelectField";
import CheckboxField from "./form/CheckboxField";
import { printTable, exportToExcel } from "../utils/tableHelper";
import MessageNotifier from "./MessageNotifier";
import { apiModalResultType, callApiSimple } from "../utils/apiHelper";
import { renderToStaticMarkup } from "react-dom/server";
import { toPersianNumberIfPersianText } from "../utils/stringHelper";
import { BsPlusSquare, BsPlusSquareFill } from "react-icons/bs";
///////////////////////////////////////////////////////////////////////////////functions////////////////////////////////////////////////////////////////////

function formatCell(value, type, maxLength) {
  switch (type) {
    case "boolean":
      return (
        <CheckboxField
          checked={!!value}
          readOnly
          classNames="pointer-events-none"
        />
      );
    case "currency":
      return new Intl.NumberFormat("fa-IR", {
        style: "currency",
        currency: "IRR",
        maximumFractionDigits: 0,
      }).format(value);
    case "formattedNumber":
      return new Intl.NumberFormat().format(value);
    case "string":
      return maxLength && typeof value === "string"
        ? value.substring(0, maxLength) + (value.length > maxLength ? "…" : "")
        : value;
    default:
      return value;
  }
}

function applyFilters(data, filters, columns) {
  let filtered = data;

  Object.entries(filters).forEach(([colName, filterVal]) => {
    if (!filterVal) return;

    const col = columns.find((c) => c.name === colName);
    if (!col) return;

    const val = filterVal.toString().toLowerCase();

    filtered = filtered.filter((row) => {
      const cellVal = row[colName];
      if (cellVal === null || cellVal === undefined) return false;

      if (col.type === "boolean") {
        return (cellVal ? "true" : "false").includes(val);
      } else {
        return cellVal.toString().toLowerCase().includes(val);
      }
    });
  });

  return filtered;
}

function applySorting(data, sortColumn, sortDirection, columns) {
  if (!sortColumn) return data;

  const col = columns.find((c) => c.name === sortColumn);
  if (!col) return data;

  const type = col.type;

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];

    if (aVal == null) return 1;
    if (bVal == null) return -1;

    if (
      type === "number" ||
      type === "currency" ||
      type === "formattedNumber"
    ) {
      const numA = Number(aVal) || 0;
      const numB = Number(bVal) || 0;
      return sortDirection === "asc" ? numA - numB : numB - numA;
    }

    if (type === "boolean") {
      const boolA = aVal ? 1 : 0;
      const boolB = bVal ? 1 : 0;
      return sortDirection === "asc" ? boolA - boolB : boolB - boolA;
    }

    const aStr = aVal.toString().toLowerCase();
    const bStr = bVal.toString().toLowerCase();

    if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
    if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return sorted;
}

/////////////////////////////////////////////////////////////////////////SearchTable////////////////////////////////////////////////////////////////////////
/**
 * کامپوننت جدول جستجو با قابلیت فیلتر، صفحه‌بندی، پرینت و export
 *
 * @component
 *
 * @param {Object} props
 * @param {Array<Object>} props.columns - تعریف ستون‌های جدول
 * @param {{
 *   type: 'json'| 'object' | 'state',
 *   reducerName?: string,
 *   filterObjectName?: string,
 *   fetchHook:function,
 *   data: Array<JSON>
 * }} props.dataSource - منبع داده‌ها (API یا state)
 * @param {{'name','label'}[]} [props.printFilterKeys] - کلیدهای فیلتر برای چاپ
 * @param {{enabled: boolean, sizeArray}} [props.pagination] - تنظیمات صفحه‌بندی
 * @param {Array<Object>} [props.actions] - اکشن‌های قابل اعمال روی هر ردیف
 * @param {boolean} [props.showRowNumber] - نمایش شماره ردیف‌ها
 * @param {string} [props.exportApiUrl] - آدرس API برای export
 * @param {'GET'|'POST'} [props.exportMethod] - متد ارسال درخواست export
 * @param {number} [props.maxHeight] - حداکثر ارتفاع جدول
 * @param {boolean} [props.showSearchRow] -ردیف جستجو نمایش داده شود
 * @param {boolean} [props.showPrintButton] -دکمه چاپ نمایش داده شود
 * @param {boolean} [props.showExcelButton] -دکمه ارسال به اکسل نمایش داده شود
 * @returns {JSX.Element}
 */

const SearchTable = forwardRef(
  (
    {
      columns = [],
      dataSource,
      printFilterKeys, // آرایه کلیدهای فیلترهایی که میخوایم چاپ بشن
      pagination = { enabled: false },
      actions = [],
      showRowNumber = true,
      exportApiUrl, // آدرس API برای export وقتی dataSource از نوع state است
      exportMethod = "POST", // روش ارسال درخواست: "GET" یا "POST"
      maxHeight = 400,
      showSearchRow = true,
      showPrintButton = true,
      showExcelButton = true,
      newRowButton = null
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    // داده redux در صورت dataSource نوع string (یعنی stateName)
    const sizeArray = pagination.sizeArray ?? [5, 10, 20, 50, 100];
    const externalFilters = useSelector((state) => {
      return dataSource.type === "state" && (dataSource.reducerName || dataSource.filterObjectName)
        ? state[dataSource.reducerName][dataSource.filterObjectName]
        : { take: 10, skip: 0 };
    }) ?? { take: 10, skip: 0 };
    const [printFontSize, setPrintFontSize] = useState(null);
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState((externalFilters?.skip ?? 0) + 1);
    const [pageSize, setPageSize] = useState(10);
    const [printModalOpen, setPrintModalOpen] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);
    const [errorText, setErrorText] = useState(null);
    const tableError = {
      type: apiModalResultType.error,
      text: errorText,
      title: "",
    };
    const [selectedPrintColumns, setSelectedPrintColumns] = useState(
      columns.map((c) => c.name)
    );
    const initSelected =
      printFilterKeys?.filter(
        (pf) =>
          externalFilters[pf.name] !== undefined &&
          externalFilters[pf.name] !== ""
      ) ?? [];
    const [selectedPrintFilters, setSelectedPrintFilters] =
      useState(initSelected);
    const [sortConfig, setSortConfig] = useState({
      column: null,
      direction: "asc",
    });
    let loading = false;
    let fetchError = null;
    let reduxData = null;
    let fetchDataList = null;
    if (dataSource.type === "state") {
      const [fetchData, { data, error, isLoading }] = dataSource.fetchHook();
      reduxData = data;
      fetchError = error;
      loading = isLoading;
      fetchDataList = fetchData;
    }
    const fetchWithFilters = (filterData) => {
      fetchDataList(filterData);
    };

    // 👇 expose کردن تابع fetch به بیرون از طریق ref
    useImperativeHandle(ref, () => ({
      fetchData: fetchWithFilters,
    }));

    const rawData = useMemo(() => {
      switch (dataSource?.type) {
        case "json":
          return {
            list: dataSource.data || [],
            totalCount: dataSource.data?.length ?? 0,
          };
        case "state":
          return {
            list: reduxData?.list || [],
            totalCount: reduxData?.totalCount,
          };
        case "object":
          return {
            list: dataSource.items || [],
            totalCount: dataSource.items?.length,
          };
      }
    }, [dataSource, reduxData]);

    const processedData = useMemo(() => {
      let tempData = rawData.list;
      tempData = applyFilters(tempData, filters, columns);
      tempData = applySorting(
        tempData,
        sortConfig.column,
        sortConfig.direction,
        columns
      );
      return { list: tempData, totalCount: rawData.totalCount };
    }, [rawData, filters, sortConfig, columns]);

    const totalRecords = pagination.enabled
      ? dataSource?.total ||
        processedData?.totalCount ||
        processedData?.list?.length || // وقتی تمام ردیفها درخواست میشود. سرور totlaCount را ممکن است ندهد
        0
      : processedData?.totalCount ?? 0;

    const totalPages =
      pagination.enabled && pageSize > 0
        ? Math.ceil(totalRecords / pageSize)
        : 1;

    const pageData = useMemo(() => {
      if (!pagination.enabled) return processedData.list;

      if (
        dataSource?.type === "json" ||
        (typeof dataSource === "object" && dataSource.items)
      ) {
        const start = (page - 1) * pageSize;
        return processedData.list.slice(start, start + pageSize);
      }

      return processedData.list;
    }, [processedData, page, pageSize, pagination.enabled, dataSource?.type]);

    const onFilterChange = (colName, value) => {
      setPage(1);
      setFilters((f) => ({ ...f, [colName]: value }));
    };

    const onSortChange = (colName) => {
      if (sortConfig.column === colName) {
        setSortConfig((cfg) => ({
          column: colName,
          direction: cfg.direction === "asc" ? "desc" : "asc",
        }));
      } else {
        setSortConfig({ column: colName, direction: "asc" });
      }
      setPage(1);
    };

    const onPageSizeChange = (e) => {
      const newSize = parseInt(e.target.value, 0);
      // اندازه صفر یعنی تمام ردیفها
      if (!isNaN(newSize) /*&& newSize > 0*/) {
        setPageSize(newSize);
        setPage(1);
      }
    };

    const fetchExportData = async () => {
      if (!exportApiUrl) {
        setErrorText("آدرس API خروجی تعریف نشده است!");
        return null;
      }
      const result = await callApiSimple(
        exportMethod,
        exportApiUrl,
        { ...externalFilters, take: 0, skip: 0 },
        null,
        setErrorText,
        externalFilters.signal
      );

      return result?.data?.list;
    };

    const handlePrint = async () => {
      let exportData = [];

      if (dataSource.type === "state") {
        exportData = await fetchExportData();
        if (!exportData) return;
      } else if (
        dataSource.type === "json" ||
        dataSource.type === "object" ||
        dataSource.items
      ) {
        exportData =
          dataSource.type === "json" ? dataSource.data : dataSource.items;
      }
      const filteredColumns = columns.filter((c) =>
        selectedPrintColumns.includes(c.name)
      );

      const filteredFilters = [];
      selectedPrintFilters.forEach((f) => {
        if (externalFilters[f.name] !== undefined)
          filteredFilters.push({
            label: f.label,
            name: f.name,
            value: externalFilters[f.name],
          });
      });
      //printTable(exportData, columns, filters, printFilterKeys);
      const printIconSvg = renderToStaticMarkup(
        <MdPrint color="#532626" size={35} />
      );
      //
      printTable(
        exportData,
        filteredColumns,
        filteredFilters,
        printFontSize,
        printIconSvg
      );
    };

    const handleExportExcel = async () => {
      let exportData = [];

      if (dataSource.type === "state") {
        exportData = await fetchExportData();
        if (!exportData) return;
      } else if (
        dataSource.type === "json" ||
        (dataSource.type === "object" && dataSource.items)
      ) {
        exportData =
          dataSource.type === "json" ? dataSource.data : dataSource.items;
      }

      exportToExcel(exportData, columns);
    };
    const closeModalError = () => {
      setErrorText(null);
    };
    const visibleColumns = columns
      .filter((col) => !isMobile || col.showOnMobile)
      .sort((a, b) => a.order - b.order);
    const togglePrintColumn = (colName) => {
      setSelectedPrintColumns((prev) =>
        prev.includes(colName)
          ? prev.filter((c) => c !== colName)
          : [...prev, colName]
      );
    };

    const togglePrintFilter = (filter) => {
      const filterKey = filter.name;
      setSelectedPrintFilters((prev) =>
        prev.some((f) => f.name === filterKey)
          ? prev.filter((f) => f.name !== filterKey)
          : [...prev, filter]
      );
    };
    const resetPageNumber = useEffectEvent(() => {
      setPage(1);
    });
    useEffect(() => {
      // وقتی دکمه جستجو کلیک می شود باید شماره صفحات ریست شود
      if (!(Number(externalFilters?.skip) > 0) && page > 1) {
        resetPageNumber();
      }
    }, [externalFilters.skip]);
    useEffect(() => {
      if (
        pagination.enabled &&
        fetchWithFilters &&
        dataSource?.type === "state" &&
        ((Number(externalFilters?.skip) !== page - 1 && page > 1) ||
          //اگر اندازه صفحه تغییر کرد باید جستجو از اول آغاز شود
          // شرط اول برای این است که بار اول که هنوز جستجویی انجام نشده خودبه خود جستجو نکند
          (!isNaN(externalFilters?.take) &&
            Number(externalFilters?.take) !== pageSize))
      ) {
        const skip = page - 1;
        //externalFilters.take = pageSize;
        fetchWithFilters({
          ...externalFilters,
          //sort: sortConfig,
          take: pageSize,
          skip,
        });
      }
    }, [page, pageSize]);
    const onTakeChange = useEffectEvent((take) => {
      setPageSize(take);
    });
    useEffect(() => {
      if (externalFilters.take && externalFilters.take !== pageSize) {
        onTakeChange(externalFilters.take);
        resetPageNumber();
      }
    }, [externalFilters.take]);
    const onLoadColumns = useEffectEvent((cols) => {
      setSelectedPrintColumns(cols.map((c) => c.name));
    });
    useEffect(() => {
      // وقتی columns تغییر می‌کنه، selectedPrintColumns رو آپدیت کن
      onLoadColumns(columns);
    }, [columns]);
    const onLoadPrintFilters = useEffectEvent((filters) => {
      const init = filters.filter(
        (pf) =>
          externalFilters[pf.name] !== undefined &&
          externalFilters[pf.name] !== ""
      );

      setSelectedPrintFilters(init);
    });
    useEffect(() => {
      // وقتی printFilterKeys تغییر می‌کنه، selectedPrintFilters رو آپدیت کن
      if (Array.isArray(printFilterKeys) && printFilterKeys.length > 0) {
        onLoadPrintFilters(printFilterKeys);
      }
    }, [printFilterKeys]);
    return (
      <>
        {/* مودال چاپ */}
        <MessageNotifier
          message={errorText ? tableError : null}
          onClose={closeModalError}
        />
        <Modal show={printModalOpen && !errorText} setShow={setPrintModalOpen}>
          <div className="p-6 max-h-[80vh] overflow-auto" dir="rtl">
            <h2 className="text-xl font-bold mb-5 text-right">تنظیمات چاپ</h2>

            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-right border-b pb-1">
                ستون‌های قابل چاپ
              </h3>
              <div className="flex flex-col max-h-44 overflow-y-auto pr-2 scroll-thin text-sm">
                {columns.map((col) => (
                  <label
                    key={col.name}
                    className="inline-flex items-center mb-2 cursor-pointer justify-between"
                    dir="rtl"
                  >
                    <span className="select-none">{col.label}</span>
                    <CheckboxField
                      //type="checkbox"
                      checked={selectedPrintColumns.includes(col.name)}
                      onChange={() => togglePrintColumn(col.name)}
                      className="ml-3"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-right border-b pb-1">
                فیلترهای قابل چاپ
              </h3>
              {!(printFilterKeys?.length > 0) && (
                <p className="text-gray-500 text-sm text-right">
                  هیچ فیلتری برای چاپ وجود ندارد.
                </p>
              )}
              <div className="flex flex-col max-h-44 overflow-y-auto pr-2 scroll-thin text-sm">
                {printFilterKeys?.map((pf) => {
                  // const label =
                  //   externalFilters.find((col) => col.name === key)?.label || key;
                  return (
                    <label
                      key={pf.name}
                      className="inline-flex items-center mb-2 cursor-pointer justify-between"
                      dir="rtl"
                    >
                      <span className="select-none">{pf.label}</span>
                      <CheckboxField
                        // type="checkbox"
                        checked={selectedPrintFilters.some(
                          (f) => f.name === pf.name
                        )}
                        onChange={() => togglePrintFilter(pf)}
                        className="ml-3"
                        disabled={
                          externalFilters[pf.name] === undefined ||
                          externalFilters[pf.name] === ""
                        }
                      />
                    </label>
                  );
                })}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-right border-b pb-1">
                اندازه فونت
              </h3>
              <SelectField
                options={[
                  { label: "9", value: "9px" },
                  { label: "10", value: "10px" },
                  { label: "11", value: "11px" },
                  { label: "12", value: "12px" },
                ]}
                onChange={(e) => setPrintFontSize(e.target.value)}
                classNames={"!bg-blue-50"}
              />
            </div>
            <div className="flex justify-start gap-3">
              <Button
                onClick={handlePrint}
                color="primary"
                classNames="!rounded !py-2"
              >
                چاپ
              </Button>
              <Button
                onClick={() => setPrintModalOpen(false)}
                textColor="blue"
                variant="outline"
                color="black"
                classNames="px-4 py-2 rounded hover:brightness-75"
              >
                انصراف
              </Button>
            </div>
          </div>
        </Modal>

        <div className="w-full overflow-x-auto p-2 relative group">
          <div className="mt-3 flex justify-between items-center gap-1">
            {/* سمت راست: انتخاب تعداد ردیف‌ها */}
            {pagination.enabled && (
              <div className="border rounded p-1 mb-0.5 border-gray-500">
                <label
                  htmlFor="pageSizeSelect"
                  className="whitespace-nowrap text-xs "
                >
                  تعداد در صفحه:
                </label>
                <select
                  id="pageSizeSelect"
                  value={pageSize}
                  onChange={onPageSizeChange}
                  className="border border-gray-400 p-1 rounded text-xs"
                >
                  <option value={0}>تمام ردیفها</option>
                  {sizeArray.map((size) => (
                    <option key={size} value={size}>
                      {`${toPersianNumberIfPersianText(size)} ردیف`}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* سمت چپ: دکمه‌های چاپ و اکسل */}
            <div className="flex gap-2">
              {newRowButton &&
              <BsPlusSquareFill color="#3d77b3" className="hover:brightness-75" size={30} onClick={newRowButton.onClick} title="ردیف جدید"/>
              }
              {showPrintButton && (
                <div
                  onClick={() => setPrintModalOpen(true)}
                  title="چاپ"
                  style={{ cursor: "pointer" }}
                >
                  <MdPrint
                    size={30}
                    color="#0a69a8"
                    className="hover:brightness-75"
                  />
                </div>
              )}
              {showExcelButton && (
                <div
                  onClick={handleExportExcel}
                  title="ارسال به اکسل"
                  style={{ cursor: "pointer" }}
                >
                  <FaRegFileExcel
                    size={27}
                    color="green"
                    className="hover:brightness-75"
                  />
                </div>
              )}
            </div>
          </div>

          <div
            className="overflow-auto border border-gray-300 rounded-md custom-scrollbar"
            style={{ maxHeight }}
          >
            <table className="min-w-max w-full  text-sm border-separate border-spacing-0">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  {showRowNumber && (
                    <th className=" sticky top-0 z-2 bg-gray-100 p-3 border border-gray-200 rounded-tl-md text-right w-px">
                      ردیف
                    </th>
                  )}
                  {visibleColumns.map((col, idx) => {
                    const isFirst = idx === 0;
                    const isLast =
                      idx === visibleColumns.length - 1 &&
                      (isMobile || actions.length === 0);

                    const isSorted = sortConfig.column === col.name;

                    return (
                      <th
                        key={col.name}
                        className={clsx(
                          "sticky top-0 bg-gray-100 z-2 p-3 border border-gray-200 select-none cursor-pointer overflow-hidden text-ellipsis",
                          col.rtl !== false ? "text-right" : "text-left",
                          isFirst ? "rounded-tr-md" : "",
                          isLast ? "rounded-tl-md" : "",
                          col.className??""
                        )}
                        onClick={() => onSortChange(col.name)}
                        title={`مرتب‌سازی بر اساس ${col.label}`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{col.label}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            {isSorted ? (
                              sortConfig.direction === "asc" ? (
                                <FaSortUp />
                              ) : (
                                <FaSortDown />
                              )
                            ) : (
                              "↕"
                            )}
                          </span>
                        </div>
                      </th>
                    );
                  })}

                  {!isMobile && actions.length > 0 && (
                    <th className=" sticky top-0 z-2 bg-gray-100 p-3 border border-gray-200 rounded-tl-md text-center w-px">
                      عملیات
                    </th>
                  )}
                </tr>
                {showSearchRow && (
                  <tr className="bg-gray-50 text-gray-700">
                    {showRowNumber && <th></th>}
                    {visibleColumns.map((col) => (
                      <th
                        key={"filter-" + col.name}
                        className={clsx(
                          "p-1 border border-gray-200",
                          col.rtl !== false ? "text-right" : "text-left", col.className??""
                        )}
                      >
                        {col.filterable !== false ? (
                          <input
                            type="text"
                            value={filters[col.name] || ""}
                            onChange={(e) =>
                              onFilterChange(col.name, e.target.value)
                            }
                            placeholder={`جستجو...`}
                            className="w-full text-xs p-1 border rounded border-blue-400 text-red-700 focus:outline-blue-400"
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : null}
                      </th>
                    ))}

                    {!isMobile && actions.length > 0 && <th></th>}
                  </tr>
                )}
              </thead>

              <tbody>
                {(loading || fetchError) && (
                  <tr>
                    <td
                      colSpan={visibleColumns.length + (showRowNumber ? 1 : 0)}
                      className="p-4"
                    ></td>
                  </tr>
                )}

                {!loading &&
                  !fetchError &&
                  pageData.map((row, rowIndex) => {
                    const isExpanded = expandedRow === rowIndex;

                    return (
                      <React.Fragment
                        key={row.id || row.key || JSON.stringify(row)}
                      >
                        <tr
                          className="even:bg-gray-50 text-gray-800 hover:bg-blue-50 cursor-pointer transition-colors"
                          onClick={() => {
                            if (isMobile)
                              setExpandedRow(isExpanded ? null : rowIndex);
                          }}
                        >
                          {showRowNumber && (
                            <td className="p-3 border border-gray-200 text-right">
                              {(page - 1) * pageSize + rowIndex + 1}
                            </td>
                          )}
                          {visibleColumns.map((col) => (
                            <td
                              key={col.name}
                              className={`p-3 border border-gray-200 overflow-hidden text-ellipsis ${
                                col.rtl !== false ? "text-right" : "text-left"
                              }`}
                            >
                              {formatCell(
                                row[col.name],
                                col.type,
                                col.maxLength
                              )}
                            </td>
                          ))}

                          {!isMobile && actions.length > 0 && (
                            <td className="p-3 border border-gray-200">
                              <div className="flex gap-2 items-center">
                                {actions.map((action, idx) => (
                                  <button
                                    key={idx}
                                    className="text-blue-600 hover:border-b hover:border-blue-600 hover:scale-110 transition duration-100 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      action.onClick(row);
                                    }}
                                    title={action.tooltip}
                                  >
                                    {action.icon} {action.label}
                                  </button>
                                ))}
                              </div>
                            </td>
                          )}
                        </tr>

                        {isMobile && isExpanded && (
                          <tr className="bg-white border-b border-gray-200">
                            <td
                              colSpan={
                                visibleColumns.length + (showRowNumber ? 1 : 0)
                              }
                            >
                              <div className="p-3 bg-gray-50 rounded-lg shadow-inner mt-1">
                                {columns
                                  .filter((col) => !col.showOnMobile)
                                  .map((col) => (
                                    <div
                                      key={col.name}
                                      className="flex gap-1 py-1 text-sm text-gray-700"
                                    >
                                      <span className="font-medium">
                                        {col.label}:
                                      </span>
                                      <span>
                                        {formatCell(
                                          row[col.name],
                                          col.type,
                                          col.maxLength
                                        )}
                                      </span>
                                    </div>
                                  ))}

                                <div className="flex gap-2 mt-2 flex-wrap">
                                  {actions.map((action, idx) => (
                                    <button
                                      key={idx}
                                      className="text-xs px-2 py-1 border rounded text-blue-700 hover:bg-blue-50"
                                      onClick={() => action.onClick(row)}
                                      title={action.tooltip}
                                    >
                                      {action.icon}
                                      {action.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
            {(loading || fetchError) && (
              <div
                className="P-0 absolute   bg-transparent top-[150px] left-1/2  pointer-events-none z-10 font-medium"
                style={{
                  transform: "translateX(-50%)",
                  //boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? (
                  <span className=" text-cyan-600 text-sm">
                    در حال بارگذاری...
                  </span>
                ) : (
                  <span className=" text-red-500 text-sm">{fetchError}</span>
                )}
              </div>
            )}
          </div>

          {pagination.enabled && (
            <div className="flex flex-col items-center justify-center mt-4 text-xs text-gray-700 gap-2">
              <div className="flex items-center gap-4">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  title="صفحه اول"
                >
                  <FaAngleDoubleRight />
                </button>
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  title="قبلی"
                >
                  <FaAngleRight />
                </button>

                <span>
                  صفحه {page} از {totalPages} ({totalRecords.toLocaleString()} )
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  title="بعدی"
                >
                  <FaAngleLeft />
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  title="صفحه آخر"
                >
                  <FaAngleDoubleLeft />
                </button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
);

export default SearchTable;
