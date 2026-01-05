import { FaPaperPlane, FaSearch, FaTrash } from "react-icons/fa";
import ErrorBoundary from "../../components/ErrorBoundry";
import SubmitForm from "../../components/form/SubmitForm";
import SearchTable from "../../components/SearchTable";
import MessageNotifier from "../../components/MessageNotifier";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  useDeleteMutation,
  useLazyGetAllQuery,
  useSendToCustomerMutation,
} from "../../store/invoice/invoiceApi";
import { apiModalResultType } from "../../utils/apiHelper";
import { useNavigate } from "react-router-dom";
import { numberToPersian, printInvoice } from "../../utils/commonFunctions";
import { renderToStaticMarkup } from "react-dom/server";
import { MdPrint, MdDelete } from "react-icons/md";
import { IoMdClipboard } from "react-icons/io";
import { FaPencil } from "react-icons/fa6";
import { useClipboard } from "../../hooks/useClipboard";

const columns = [
  {
    type: "string",
    name: "invoiceNumber",
    order: 1,
    maxLength: 20,
    label: "شماره فاکتور",
    className: "w-[125px]",
  },
  {
    type: "string",
    name: "pInvoiceDate",
    order: 2,
    maxLength: 20,
    label: "تاریخ فاکتور",
    showOnMobile: true,
    className: "w-[120px]",
  },
  {
    type: "string",
    name: "customerName",
    order: 3,
    maxLength: 20,
    label: "نام مشتری",
    showOnMobile: true,
  },
  {
    type: "string",
    name: "customerMobile",
    order: 3,
    maxLength: 20,
    label: "شماره همراه مشتری",
    showOnMobile: false,
  },
  {
    type: "formattedNumber",
    name: "invoiceNetPrice",
    order: 4,
    maxLength: 20,
    label: "قابل پرداخت",
    className: "w-[150px]",
  },

  {
    type: "string",
    name: "description",
    order: 5,
    maxLength: 200,
    label: "شرح فاکتور",
  },
  {
    type: "string",
    name: "pSentToCustomerDate",
    order: 6,
    label: "تاریخ ارسال",
    className: "w-px",
  },
];
export default function SearchInvoices() {
  const navigate = useNavigate();
  const copy = useClipboard();
  const [message, setMessage] = useState(null);
  const tableRef = useRef(null);
  const [
    sendToCustomer,
    {
      // data: sendToCustomerResult,
      // isFetching: loadingSendToCustomer,
      error: errorSendToCustomer,
    },
  ] = useSendToCustomerMutation();
  const [
    deleteInvoice,
    { isLoading: loadingDeleteInvoice, error: errorDeleteInvoice },
  ] = useDeleteMutation();
  const searchFields = [
    {
      name: "invoiceNumber",
      type: "text",
      title: "شماره فاکتور",
      len: "md:2",
    },
    {
      name: "invoiceDateFrom",
      type: "date",
      title: "تاریخ فاکتور از",
      len: "md:2",
    },
    {
      name: "invoiceDateTo",
      type: "date",
      title: "تاریخ فاکتور تا",
      len: "md:2",
    },
    { name: "customerName", type: "text", title: "نام مشتری", len: "md:2" },
    {
      name: "customerMobile",
      type: "number",
      title: "شماره همراه مشتری",
      len: "md:2",
    },
    { name: "description", type: "text", title: "شرح فاکتور", len: "md:2" },
  ];
  const closeModalError = () => {
    setMessage(null);
  };
  const sendInvoiceToCustomer = async (row) => {
    await sendToCustomer(row.id).unwrap();
    setMessage({
      type: apiModalResultType.info,
      text: "عملیات با موفقیت انجام شد",
      title: "ارسال فاکتور به مشتری",
    });
  };
  const deleteRow = async (row) => {
    if (loadingDeleteInvoice) {
      return;
    }
    await deleteInvoice(row.id).unwrap();
    setMessage({
      title: "حذف فاکتور",
      type: apiModalResultType.info,
      text: "عملیات با موفقیت انجام شد.",
    });
  };
  const showDeleteConfirm = (row) => {
    setMessage({
      title: `حذف فاکتور ${row.invoiceNumber}`,
      type: apiModalResultType.confirm,
      text: "آیا از حذف مطمئن هستید؟",
      onConfirm: () => deleteRow(row),
    });
  };
  const fetchData = (filters) => {
    tableRef.current.fetchData(filters);
  };
  const gotoInvoice = (row) => {
    navigate(`/invoice/${row.id}`);
  };
  const onError = useEffectEvent((error) => {
    setMessage({
      title: "حذف فاکتور",
      type: apiModalResultType.error,
      text: error,
    });
  });
  const handlePrintInvoice = (row) => {
    const detailsCols = [
      { name: "productName", label: "شرح" },
      {
        name: "productCount",
        label: "مدت",
      },
      { name: "unitPrice", label: "مبلغ(ریال)", type: "currency" },
      { name: "netPrice", label: "جمع کل(ریال)", type: "currency" },
    ];
    const printData = {
      ...row,
      invoiceDetails: [
        {
          productName: row.description,
          productCount: `${numberToPersian(row.guaranteeTime)} ${
            row.guaranteeType == 0 ? "ساله" : "مرتبه"
          }`,
          unitPrice: row.invoiceTotalPrice,
          netPrice: row.invoiceTotalPrice,
        },
        {
          productName: "ارزش افزوده",
          productCount: 1,
          unitPrice: row.taxAmount,
          netPrice: row.taxAmount,
        },
      ],
    };
    const printIconSvg = renderToStaticMarkup(
      <MdPrint color="#532626" size={35} />
    );
    printInvoice(printData, detailsCols, undefined, printIconSvg);
  };
  const handleCopy = (row) => {
    const copyData =
      "مشتری: " +
      row.customerName +
      "\n" +
      "تماس گیرنده: " +
      (row.callerName ?? "") +
      "\n" +
      "شماره همراه: " +
      (row.customerMobile ?? "") +
      "\n" +
      "سریال محصولات: " +
      (row.productSerials ?? "") +
      "\n" +
      "شرح فاکتور: " +
      (row.description ?? "");
    copy(copyData);
  };
  useEffect(() => {
    if (errorDeleteInvoice) {
      onError(errorDeleteInvoice);
    } else if (errorSendToCustomer) {
      onError(errorSendToCustomer);
    }
  }, [errorDeleteInvoice, errorSendToCustomer]);
  useEffect(() => {
    fetchData({});
  }, []);
  return (
    <ErrorBoundary>
      <main className="px-4 py-8">
        <MessageNotifier message={message} onClose={closeModalError} />
        <SubmitForm
          onSubmit={fetchData}
          fields={searchFields}
          formTitle="جستجوی فاکتور"
          submitIcon={FaSearch}
          submitText="جستجو"
          isPartial={true}
        />
        <SearchTable
          ref={tableRef}
          columns={columns}
          dataSource={{
            type: "state",
            fetchHook: useLazyGetAllQuery,
            reducerName: "invoice",
            filterObjectName: "searchInvoicesFilters",
          }}
          //filters={filters}
          exportApiUrl="/api/Invoice/GetALL"
          pagination={{ enabled: false }}
          actions={[
            {
              label: "ویرایش",
              icon: <FaPencil size={14} color="orange" className="inline" />,
              onClick: gotoInvoice,
            },
            {
              label: "چاپ",
              icon: <MdPrint size={15} color="#25875e" className="inline" />,
              onClick: handlePrintInvoice,
            },

            {
              label: "ارسال",
              icon: <FaPaperPlane size={12} color="blue" className="inline" />,
              onClick: sendInvoiceToCustomer,
            },
            {
              label: "کپی",
              icon: (
                <IoMdClipboard size={15} color="#eb4e12" className="inline" />
              ),
              onClick: handleCopy,
            },
            {
              label: "حذف",
              icon: <FaTrash size={13} color="#ff2f00" className="inline" />,
              onClick: showDeleteConfirm,
            },
          ]}
          isMobile={false}
        />
      </main>
    </ErrorBoundary>
  );
}
