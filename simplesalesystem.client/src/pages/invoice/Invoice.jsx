import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../components/Modal";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  useCreateMutation,
  useLazyGetNextNumberQuery,
  useLazyGetQuery,
  useUpdateMutation,
} from "../../store/invoice/invoiceApi";
import { apiModalResultType } from "../../utils/apiHelper";
import Row from "../../components/layout/Row";
import DateTimePicker from "../../components/form/DateTimePicker";
import { useLazyGetAllQuery as useSearchPerson } from "../../store/person/personApi";
import { useLazyGetAllQuery as useGetAllProducts } from "../../store/product/productApi";
import SearchableSelectField from "../../components/form/SearchableSelectField";
import MessageNotifier from "../../components/MessageNotifier";
import { useForm } from "react-hook-form";
import Col from "../../components/layout/Col";
import Button from "../../components/Button";
import { FaCheck, FaPencilAlt } from "react-icons/fa";
import NumericInputField from "../../components/form/NumericInputField";
import { MoonLoader } from "react-spinners";
import SearchTable from "../../components/SearchTable";
import { FaPaperPlane, FaPrint } from "react-icons/fa6";
import { numberToPersian, printInvoice } from "../../utils/commonFunctions";
import SelectField from "../../components/form/SelectField";
import InputField from "../../components/form/InputField";
import { useLazyGetAllInvoiceDescsQuery } from "../../store/invoiceDefaultDesc/invoiceDefaultDescApi";
import { renderToStaticMarkup } from "react-dom/server";
import { MdCreate, MdPrint } from "react-icons/md";
import { BsClipboard, BsClipboardCheck, BsDashCircle } from "react-icons/bs";
import { useLazyGetSettingQuery } from "../../store/systemSetting/settingApi";
import useIsMobile from "../../hooks/useIsMobile";
import moment from "moment-jalaali";
import { BiCalendarCheck, BiCalendarEdit, BiUser } from "react-icons/bi";

export default function Invoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tableRef = useRef();
  const isMobile = useIsMobile();
  const [copyDone, setCopyDone] = useState(false);
  const [
    getNextNumber,
    {
      data: invoiceNumber,
      isLoading: loadingNumber,
      error: getNextNumberError,
    },
  ] = useLazyGetNextNumberQuery();
  const [
    searchPerson,
    {
      data: personData = { list: [] },
      isLoading: loadingPersonList,
      error: loadingPersonError,
    },
  ] = useSearchPerson();
  const [
    getProducts,
    {
      data: productList = { list: [] },
      isLoading: loadingProducts,
      error: productsError,
    },
  ] = useGetAllProducts();
  const [create, { error: createError, isLoading: loadingCreate }] =
    useCreateMutation();
  const [update, { error: updateError, isLoading: loadingUpdate }] =
    useUpdateMutation();
  const [getInvoice, { error: getError, isLoading: loadingInvoice }] =
    useLazyGetQuery();
  const [getAllDescs, { data: defaultDescList }] =
    useLazyGetAllInvoiceDescsQuery();
  const [getSystemSetting] = useLazyGetSettingQuery();
  const { control } = useForm();
  const [invoice, setInvoice] = useState({
    guaranteeType: 0,
    invoiceDate: moment().format("YYYY-MM-DD"),
  });
  const [invoiceMessage, setInvoiceMessage] = useState(null);
  const [currentDetail, setCurrentDetail] = useState(null);
  const tableCols = [
    {
      type: "string",
      name: "productName",
      order: 1,
      maxLength: 20,
      label: "نام محصول",
      showOnMobile: true,
    },
    {
      type: "number",
      name: "productCount",
      order: 2,
      maxLength: 20,
      label: "تعداد",
    },
    {
      type: "formattedNumber",
      name: "unitPrice",
      order: 3,
      maxLength: 20,
      label: "بهای واحد",
    },
    {
      type: "formattedNumber",
      name: "netPrice",
      order: 3,
      maxLength: 20,
      label: "بهای کل",
    },
  ];

  const getInvoiceNumber = async (invoiceId) => {
    if (!(Number(invoiceId) > 0)) {
      await getNextNumber();
    }
  };
  const onError = useEffectEvent((errorText) => {
    setInvoiceMessage({
      type: apiModalResultType.error,
      text: errorText,
      title: "ثبت/ویرایش فاکتور",
    });
  });
  const closeModalError = () => {
    setInvoiceMessage(null);
  };
  const handleSubmit = async () => {
    if (!invoice?.invoiceDate) {
      return;
    }

    if (!(invoice.invoiceDetails?.length > 0)) {
      return;
    }
    const submitData = { ...invoice };
    if (!invoice.guaranteeType) {
      submitData.guaranteeType = 0;
    }
    if (!invoice.guaranteeTime) {
      submitData.guaranteeTime = 1;
    }
    if (Number(id) > 0) {
      await update(submitData).unwrap();
    } else {
      submitData.id = 0;
      const result = await create(submitData).unwrap();
      navigate(`/invoice/${result.data.id}`);
    }
    setInvoiceMessage({
      text: "ثبت/ویرایش اطلاعات فاکتور با موفقیت انجام شد",
      title: "ثبت اطلاعات فاکتور",
      type: apiModalResultType.info,
    });
  };
  const handleDeleteRow = (row) => {
    // const found = invoice.invoiceDetails.find(d=> Number(d.id) === Number(row.id));
    const newDetails = invoice.invoiceDetails.filter(
      (d) => Number(d.id) !== Number(row.id)
    );
    const totalPrice = newDetails
      .map((d) => d.totalPrice)
      .reduce((a, b) => a + b, 0);
    const pureTotalPrice = newDetails
      .map((d) => d.pureTotalPrice)
      .reduce((a, b) => a + b, 0);
    setInvoice({
      ...invoice,
      totalPrice: totalPrice,
      pureTotalPrice: pureTotalPrice,
      invoiceDetails: [...newDetails, { ...row, signedForDelete: true }],
    });
  };
  const onGetInvoice = useEffectEvent(async (id) => {
    if (Number(id) > 0) {
      const result = await getInvoice(id).unwrap();
      setInvoice(result);
    }
  });
  const onInvoiceClose = () => {
    navigate(-1);
  };
  const onSetCustomer = async (customerId) => {
    await getProducts();
    const initDetails = productList?.list
      .filter(
        (p) => Number(p.defaultCount) > 0 && Number(p.defaultSalePrice) > 0
      )
      .map((p) => ({
        unitPrice: Number(p.defaultSalePrice),
        productCount: Number(p.defaultCount),
        netPrice: Number(p.defaultSalePrice) * Number(p.defaultCount),
      }));
    const invoiceNetPrice = initDetails
      .filter((d) => !d.signedForDelete)
      .map((d) => Number(d.netPrice))
      .reduce((a, b) => a + b, 0);
    const person = personData.list.find((p) => p.id === customerId);
    setInvoice({
      ...invoice,
      productSerials: person.productSerials,
      invoiceNetPrice: invoiceNetPrice,
      invoiceTotalPrice: invoiceNetPrice,
      invoiceDetails: initDetails,
      customerID: customerId,
    });
  };

  const handleDetailChange = (e) => {
    const detailCopy = { ...currentDetail };
    detailCopy[e.target.name] = Number(e.target.value);
    detailCopy.netPrice =
      Number(detailCopy.unitPrice ?? 0) * Number(detailCopy.productCount ?? 0);
    detailCopy.totalPrice = detailCopy.netPrice;
    setCurrentDetail(detailCopy);
  };
  const handleSubmitDetail = () => {
    const found =
      invoice.invoiceDetails?.find?.(
        (d) => Number(d.productID) === Number(currentDetail.productID)
      ) ?? {};
    const newDetail = { ...found, ...currentDetail };
    const newDetails =
      invoice.invoiceDetails?.filter?.(
        (d) => Number(d.productID) !== Number(currentDetail.productID)
      ) ?? [];
    if (Number(newDetail.productCount) > 0 && Number(newDetail.unitPrice) > 0) {
      newDetails.push(newDetail);
    }
    const invoiceTotalPrice = newDetails
      .filter((d) => !d.signedForDelete)
      .map((d) => Number(d.netPrice))
      .reduce((a, b) => a + b, 0);
    let invoiceNetPrice = newDetails
      .filter((d) => !d.signedForDelete)
      .map((d) => Number(d.netPrice))
      .reduce((a, b) => a + b, 0);
    let discountPercent = Number(invoice.discountPercent ?? 0);
    let discountAmount = Number(invoice.discountAmount ?? 0);
    let taxPercent = Number(invoice.taxPercent ?? 0);
    let taxAmount = Number(invoice.taxAmount ?? 0);

    if (discountPercent > 0) {
      discountAmount = (invoiceNetPrice * discountPercent) / 100;
    } else if (discountAmount > 0) {
      discountPercent = (discountAmount / invoiceNetPrice) * 100;
    }
    invoiceNetPrice -= discountAmount;
    if (taxPercent > 0) {
      taxAmount = (invoiceNetPrice * taxPercent) / 100;
    } else if (taxAmount > 0) {
      taxPercent = (taxAmount / invoiceNetPrice) * 100;
    }
    invoiceNetPrice = invoiceNetPrice - discountAmount + taxAmount;

    setInvoice({
      ...invoice,
      totalPrice: invoiceTotalPrice,
      invoiceNetPrice: invoiceNetPrice,
      discountPercent: discountPercent,
      discountAmount: discountAmount,
      txtPercent: taxPercent,
      taxAmount: taxAmount,
      invoiceDetails: newDetails,
    });
    setCurrentDetail(null);
  };
  const handleCancelDetail = () => {
    setCurrentDetail(null);
  };

  const handlePrint = () => {
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
      ...invoice,
      invoiceDetails: [
        {
          productName: invoice.description,
          productCount: `${numberToPersian(invoice.guaranteeTime)} ${
            invoice.guaranteeType == 0 ? "ساله" : "مرتبه"
          }`,
          unitPrice: invoice.invoiceTotalPrice,
          netPrice: invoice.invoiceTotalPrice,
        },
        {
          productName: "ارزش افزوده",
          productCount: 1,
          unitPrice: invoice.taxAmount,
          netPrice: invoice.taxAmount,
        },
      ],
    };
    const printIconSvg = renderToStaticMarkup(
      <MdPrint color="#532626" size={35} />
    );
    printInvoice(printData, detailsCols, undefined, printIconSvg);
  };
  const handlePriceChange = (e) => {
    const newDetails =
      invoice.invoiceDetails?.filter?.((d) => !d.signedForDelete) ?? [];
    const invoiceTotalPrice = newDetails
      .map((d) => Number(d.netPrice))
      .reduce((a, b) => a + b, 0);
    let invoiceNetPrice = newDetails
      .map((d) => Number(d.netPrice))
      .reduce((a, b) => a + b, 0);
    const invoiceCopy = { ...invoice };
    invoiceCopy.discountPercent = Number(invoiceCopy.discountPercent ?? 0);
    invoiceCopy.discountAmount = Number(invoiceCopy.discountAmount ?? 0);
    invoiceCopy.taxPercent = Number(invoiceCopy.taxPercent ?? 0);
    invoiceCopy.taxAmount = Number(invoiceCopy.taxAmount ?? 0);
    invoiceCopy[e.target.name] = Number(e.target.value ?? 0);
    if (invoiceCopy.discountPercent > 100) {
      invoiceCopy.discountPercent = 100;
    }
    if (invoiceCopy.discountAmount > invoiceTotalPrice) {
      invoiceCopy.discountAmount = invoiceTotalPrice;
    }
    if (invoiceCopy.taxPercent > 100) {
      invoiceCopy.taxPercent = 100;
    }
    if (invoiceCopy.taxAmount > invoiceCopy.invoiceTotalPrice) {
      invoiceCopy.taxAmount = invoiceCopy.invoiceTotalPrice;
    }
    //این شرط یعنی اولویت با درصد است. هر فیلد مبلغی غیر از مقدار تخفیف که تغییر کند، مقدار تخفیف برحسب درصد محاسبه خواهد شد
    if (e.target.name !== "discountAmount") {
      invoiceCopy.discountAmount =
        (invoiceNetPrice * invoiceCopy.discountPercent) / 100;
    } else if (e.target.name === "discountAmount") {
      invoiceCopy.discountPercent = (
        (invoiceCopy.discountAmount / invoiceNetPrice) *
        100
      ).toFixed(2);
    }
    invoiceNetPrice -= invoiceCopy.discountAmount;
    invoiceCopy.taxAmount = (invoiceNetPrice * invoiceCopy.taxPercent) / 100;

    invoiceNetPrice += invoiceCopy.taxAmount;

    setInvoice({
      ...invoiceCopy,
      totalPrice: invoiceTotalPrice,
      invoiceNetPrice: invoiceNetPrice,
      invoiceDetails: newDetails,
    });
  };
  const prepareAddDetails = async () => {
    setCurrentDetail({});
    if (!(productList?.list?.length > 0)) {
      await getProducts();
    }
  };
  const prepareEditDetail = async (row) => {
    setCurrentDetail({
      ...row,
      countIsEditableInSelect: true,
      priceIsEditableInSelect: true,
    });
  };
  const handleChangeProduct = (productID) => {
    const prod = productList.list.find(
      (p) => Number(p.id) === Number(productID)
    );
    setCurrentDetail({
      ...currentDetail,
      productID: productID,
      unitPrice: Number(prod.defaultSalePrice),
      productCount: 1,
      netPrice: Number(prod.defaultSalePrice),
      countIsEditableInSelect: prod.countIsEditableInSelect,
      priceIsEditableInSelect: prod.priceIsEditableInSelect,
      productName: prod.productName,
    });
  };
  const sendInvoiceToCustomer = async () => {
    const result = await sendToCustomer(id).unwrap();
    setInvoice({ ...invoice, pSentToCustomerDate: result });
  };
  const handleCopy = () => {
    const copyData =
      "مشتری: " +
      (invoice.customerName ?? "") +
      "\n" +
      "تماس گیرنده: " +
      (invoice.callerName ?? "") +
      "\n" +
      "شماره همراه: " +
      (invoice.customerMobile ?? "") +
      "\n" +
      "سریال محصولات: " +
      (invoice.productSerials ?? "") +
      "\n" +
      "شرح فاکتور: " +
      (invoice.description ?? "");
    navigator.clipboard.writeText(copyData).then(() => {
      setCopyDone(true);
      setTimeout(() => {
        setCopyDone(false);
      }, 5000);
    });
  };
  const getSetting = async () => {
    const result = await getSystemSetting("DefaultTaxPercent").unwrap();
    setInvoice({ ...invoice, taxPercent: Number(result) });
  };
  const settingEvent = useEffectEvent(() => {
    getSetting();
  });
  useEffect(() => {
    const error =
      getNextNumberError ||
      getError ||
      updateError ||
      createError;
    if (error) {
      onError(error);
    }
  }, [
    getNextNumberError,
    getError,
    createError,
    updateError,
  ]);

  useEffect(() => {
    getInvoiceNumber(id);
    onGetInvoice(id);
    getAllDescs();
  }, [id]);
  useEffect(() => {
    settingEvent();
  }, []);
  if (loadingNumber || loadingInvoice) {
    return (
      <div className="flex align-middle content-center">
        <MoonLoader size={45} className="m-auto" color="#2a696c" />
      </div>
    );
  }
  return (
    <Modal show={true} size="5xl" onClose={onInvoiceClose} rootClose={false}>
      <MessageNotifier message={invoiceMessage} onClose={closeModalError} />
      <Modal.Header>
        فاکتور شماره{" "}
        {Number(id) > 0 ? invoice?.invoiceNumber ?? "" : invoiceNumber} &nbsp;
        {invoice?.pSentToCustomerDate && !isMobile && (
          <span className="text-sm text-blue-500">
            [تاریخ ارسال برای مشتری: {invoice.pSentToCustomerDate}]
          </span>
        )}
      </Modal.Header>
      <Modal.Body className="min-h-[400px]">
        <Row mode="flex" className="border p-2 rounded border-gray-300">
          <Col span={12} responsive={{ md: "3" }}>
            <DateTimePicker
              label="تاریخ فاکتور"
              value={invoice?.invoiceDate ?? null}
              control={control}
              onChange={(value) =>
                setInvoice({ ...invoice, invoiceDate: value.date })
              }
            />
          </Col>
          <Col span={12} responsive={{ md: "3" }}>
            <SearchableSelectField
              label="مشتری"
              name="customerId"
              value={invoice?.customerID}
              rtl={true}
              onChange={onSetCustomer}
              mode="remote"
              remoteSearch={(term) => searchPerson({ PersonName: term })}
              remoteData={
                Number(id) > 0 && invoice
                  ? [{ value: invoice.customerID, label: invoice.customerName }]
                  : personData.list.map((p) => ({
                      value: p.id,
                      label: p.personName,
                    }))
              } // تبدیل داده به {value,label}
              remoteLoading={loadingPersonList}
              remoteError={loadingPersonError}
            />
          </Col>
          <Col span={12} responsive={{ md: "3" }}>
            <SelectField
              hasEmptyOption={false}
              label="نوع گارانتی"
              options={[
                { value: "0", title: "سالانه" },
                { value: "1", title: "یک بار" },
              ]}
              valueName="value"
              displayName="title"
              defaultValue={invoice?.guaranteeType ?? "0"}
              onChange={(e) =>
                setInvoice({
                  ...invoice,
                  guaranteeType: Number(e.target.value),
                })
              }
            />
          </Col>
          {Number(invoice?.guaranteeType) === 0 && (
            <Col span={12} responsive={{ md: "3" }}>
              <NumericInputField
                label="مدت گارانتی"
                name="guaranteeTime"
                defaultValue={invoice?.guaranteeTime ?? 1}
                onChange={(e) =>
                  setInvoice({ ...invoice, guaranteeTime: e.target.value })
                }
              />
            </Col>
          )}
        </Row>
        {currentDetail && !isMobile && (
          <div className="border rounded-xl p-4 border-gray-300">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className=" w-1/2">
                    <SearchableSelectField
                      label="محصول"
                      name="productID"
                      value={currentDetail.productID}
                      rtl={true}
                      onChange={handleChangeProduct}
                      mode="local"
                      options={
                        Number(currentDetail.id) > 0
                          ? [
                              {
                                value: currentDetail.productID,
                                label: currentDetail.productName,
                              },
                            ]
                          : productList.list.map((p) => ({
                              value: p.id,
                              label: p.productName,
                            }))
                      }
                    />
                  </td>
                  <td>
                    <NumericInputField
                      name="unitPrice"
                      label="بهای واحد"
                      onChange={handleDetailChange}
                      defaultValue={currentDetail.unitPrice}
                      readOnly={!currentDetail.priceIsEditableInSelect}
                    />
                  </td>
                  <td>
                    <NumericInputField
                      label="تعداد"
                      defaultValue={currentDetail.productCount}
                      name="productCount"
                      onChange={handleDetailChange}
                      readOnly={!currentDetail.countIsEditableInSelect}
                    />
                  </td>
                  <td className="w-1/4">
                    <NumericInputField
                      label="بهای کل"
                      defaultValue={currentDetail.netPrice}
                      name="netPrice"
                      readOnly={true}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="mt-1 gap-1 flex">
              <Button
                text="تایید"
                color="success"
                icon={FaCheck}
                onClick={handleSubmitDetail}
              />
              <Button
                text="انصراف"
                color="danger"
                icon={BsDashCircle}
                onClick={handleCancelDetail}
              />
            </div>
          </div>
        )}
        {currentDetail && isMobile && (
          <div className="border rounded-xl p-4 border-gray-300">
            <Row mode="flex">
              <Col span={12}>
                <SearchableSelectField
                  label="محصول"
                  name="productID"
                  value={currentDetail.productID}
                  rtl={true}
                  onChange={handleChangeProduct}
                  mode="local"
                  options={
                    Number(currentDetail.id) > 0
                      ? [
                          {
                            value: currentDetail.productID,
                            label: currentDetail.productName,
                          },
                        ]
                      : productList.list.map((p) => ({
                          value: p.id,
                          label: p.productName,
                        }))
                  }
                />
              </Col>
              <Col span={12}>
                <NumericInputField
                  name="unitPrice"
                  label="بهای واحد"
                  onChange={handleDetailChange}
                  defaultValue={currentDetail.unitPrice}
                  readOnly={!currentDetail.priceIsEditableInSelect}
                />
              </Col>
              <Col span={12}>
                <NumericInputField
                  label="تعداد"
                  defaultValue={currentDetail.productCount}
                  name="productCount"
                  onChange={handleDetailChange}
                  readOnly={!currentDetail.countIsEditableInSelect}
                />
              </Col>
              <Col span={12}>
                <NumericInputField
                  label="بهای کل"
                  defaultValue={currentDetail.netPrice}
                  name="netPrice"
                  readOnly={true}
                />
              </Col>
            </Row>
            <div className="mt-1 gap-1 flex">
              <Button
                text="تایید"
                color="success"
                icon={FaCheck}
                onClick={handleSubmitDetail}
              />
              <Button
                text="انصراف"
                color="danger"
                icon={BsDashCircle}
                onClick={handleCancelDetail}
              />
            </div>
          </div>
        )}
        <SearchTable
          ref={tableRef}
          columns={tableCols}
          showSearchRow={false}
          showPrintButton={false}
          showExcelButton={false}
          newRowButton={
            currentDetail ? undefined : { onClick: prepareAddDetails }
          }
          dataSource={{
            type: "json",
            data: invoice?.invoiceDetails
              ? invoice.invoiceDetails.filter((d) => !d.signedForDelete)
              : [],
          }}
          pagination={{ enabled: false }}
          actions={[
            {
              label: "ویرایش",
              icon: "✏️",
              onClick: prepareEditDetail,
            },
            {
              label: "حذف",
              icon: "🗑️",
              onClick: handleDeleteRow,
            },
          ]}
          isMobile={false}
        />
        <div className="border border-gray-300 rounded p-2">
          <Row mode="flex">
            <Col span={12} responsive={{ md: "2" }}>
              <NumericInputField
                name="discountPercent"
                defaultValue={invoice?.discountPercent}
                onChange={handlePriceChange}
                label="درصد تخفیف"
              />
            </Col>
            <Col span={12} responsive={{ md: "2" }}>
              <NumericInputField
                name="discountAmount"
                defaultValue={invoice?.discountAmount}
                onChange={handlePriceChange}
                label="مبلغ تخفیف"
              />
            </Col>
            <Col span={12} responsive={{ md: "2" }}>
              <NumericInputField
                name="taxPercent"
                defaultValue={invoice?.taxPercent}
                onChange={handlePriceChange}
                label="درصد ارزش افزوده"
              />
            </Col>
            <Col span={12} responsive={{ md: "2" }}>
              <NumericInputField
                name="taxAmount"
                defaultValue={invoice?.taxAmount}
                onChange={handlePriceChange}
                label="مبلغ ارزش افزوده"
                readOnly
              />
            </Col>
            <Col span={12} responsive={{ md: "4" }}>
              <NumericInputField
                name="invoiceNetPrice"
                defaultValue={invoice?.invoiceNetPrice}
                onChange={handlePriceChange}
                label="قابل پرداخت"
                readOnly
              />
            </Col>
          </Row>
          <Row mode="flex">
            <Col span={12} responsive={{ md: "6" }}>
              <InputField
                name="description"
                label="شرح فاکتور"
                dataList={defaultDescList?.list?.map((dl) => dl.description)}
                defaultValue={invoice?.description ?? ""}
                onChange={(e) =>
                  setInvoice({ ...invoice, description: e.target.value })
                }
              />
            </Col>
            <Col span={12} responsive={{ md: "6" }}>
              <InputField
                name="productSerials"
                label="شماره سریال ها"
                defaultValue={invoice?.productSerials ?? ""}
                onChange={(e) =>
                  setInvoice({ ...invoice, productSerials: e.target.value })
                }
              />
            </Col>
            <Col span={12} responsive={{ md: "6" }}>
              <InputField
                name="callerName"
                label="نام  تماس گیرنده"
                defaultValue={invoice?.callerName ?? ""}
                onChange={(e) =>
                  setInvoice({ ...invoice, callerName: e.target.value })
                }
              />
            </Col>
            <Col span={12} responsive={{ md: "6" }}>
              <InputField
                name="moreDescription"
                label="سایر توضیحات"
                defaultValue={invoice?.moreDescription ?? ""}
                onChange={(e) =>
                  setInvoice({ ...invoice, moreDescription: e.target.value })
                }
              />
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-start relative">
        <Button
          onClick={handleSubmit}
          icon={Number(id) > 0 ? <FaPencilAlt /> : <FaCheck />}
          text={
            isMobile
              ? ""
              : Number(id) > 0
              ? "ویرایش اطلاعات فاکتور"
              : "ثبت اطلاعات فاکتور"
          }
          isLoading={loadingCreate || loadingUpdate}
          color="success"
        />
        {/* <Button
          icon={FaArrowLeft}
          color="danger"
          text="انصراف"
          onClick={onInvoiceClose}
        /> */}
        {Number(id) > 0 && (
          <Button
            icon={FaPrint}
            color="gray"
            text={isMobile ? "" : "چاپ فاکتور"}
            onClick={handlePrint}
          />
        )}
        {/* {Number(id) > 0 && !invoice?.pSentToCustomerDate && (
          <Button
            icon={FaPaperPlane}
            color=""
            text={isMobile ? "" : "ارسال شد"}
            onClick={sendInvoiceToCustomer}
          />
        )} */}
        {Number(id) > 0 && (
          <Button
            icon={copyDone ? BsClipboardCheck : BsClipboard}
            text={isMobile ? "" : "کپی اطلاعات"}
            onClick={handleCopy}
            disabled={copyDone}
          />
        )}
        {Number(id) > 0 &&
        <div className="absolute left-5 bottom-2 text-[9px] text-cyan-900">
          <div>
            <BiUser className="inline" /> <span>ثبت کننده: </span>
            <span>{invoice.createByName}</span>
          </div>
          <div>
            <BiCalendarCheck className="inline" /> <span>تاریخ ثبت: </span>
            {invoice.pCreationDate}
          </div>
          {invoice.updateByName?.length > 0 && (
            <>
              <div>
                <BiUser className="inline" /> <span>ویرایش کننده: </span>
                <span>{invoice.createByName}</span>
              </div>
              <div>
                <BiCalendarEdit className="inline" /> <span>تاریخ ویرایش: </span>
                {invoice.pUpdatingDate}
              </div>
            </>
          )}
        </div>}
      </Modal.Footer>
    </Modal>
  );
}
