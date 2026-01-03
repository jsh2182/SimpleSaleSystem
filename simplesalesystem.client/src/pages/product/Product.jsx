import { useEffect, useState, useEffectEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiModalResultType } from "../../utils/apiHelper";
import MessageNotifier from "../../components/MessageNotifier";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import {
  useCreateMutation,
  useLazyGetQuery,
  useUpdateMutation,
} from "../../store/product/productApi";
import { MoonLoader } from "react-spinners";
import SubmitForm from "../../components/form/SubmitForm";
import Modal from "../../components/Modal";

export default function Product() {
  const { id } = useParams();
  const [create, { error: createError }] = useCreateMutation();
  const [update, { error: updateError }] = useUpdateMutation();
  const [getProduct, { data: productInfo, error: getError, isLoading, reset }] =
    useLazyGetQuery();
  const navigate = useNavigate();
  const [productMessage, setProductMessage] = useState(null);
   const [resetModal, setResetModal] = useState(false);
  const fields = [
    { name: "ID", title: "", type: "hidden" },
    // {
    //   name: "ProductCode",
    //   title: "کد محصول",
    //   type: "number",
    //   len: "md:12",
    //   parentClassName: Number(id) > 0 ? "" : "hidden",
    // },
    {
      name: "ProductName",
      title: "نام محصول",
      type: "text",
      len: "md:12",
      required: "نام محصول الزامی است",
    },
    {
      name: "DefaultSalePrice",
      title: "بهای محصول",
      type: "currency",
      len: "md:12",
      // required:"بهای محصول الزامی است",
    },
    {
      name: "PriceIsEditableInSelect",
      title: "بهای محصول قابل ویرایش باشد",
      type: "check",
      len: "md:12",
    },
    {
      name: "CountIsEditableInSelect",
      title: "تعداد محصول قابل ویرایش باشد",
      type: "check",
      len: "md:12",
    },
  ];

  const extraButtons = [
    {
      text: "انصراف",
      onClick: () => {
        navigate(-1);
      },
      color: "danger",
      icon: <FaArrowLeft />,
    },
  ];

  function closeModalError() {
    setProductMessage(null);
  }

  const handleSubmit = async (data) => {
    if (Number(id) > 0) {
      await update(data).unwrap();
    } else {
      data.ProductCode = 0;
      data.ID = 0;
      const result = await create(data).unwrap();
     // navigate(`/products/${result.data.id}`);
     reset();
         setResetModal(true);
    setTimeout(() => {
      setResetModal(false);
    }, 50);
    }
    setProductMessage({
      text: "ثبت/ویرایش اطلاعات محصول با موفقیت انجام شد",
      title: "ثبت اطلاعات محصول",
      type: apiModalResultType.info,
    });
  };
  // ----------- استفاده از useEffectEvent برای جلوگیری از هشدار -------------
  const showErrorMessage = useEffectEvent((errorText) => {
    setProductMessage({
      type: apiModalResultType.error,
      text: errorText,
      title: "ثبت/ویرایش محصول",
    });
  });

  // وقتی createError تغییر کند، این effect اجرا می‌شود
  useEffect(() => {
    const errorMessage = createError || updateError || getError;
    if (errorMessage) {
      showErrorMessage(errorMessage);
    }
  }, [createError, updateError, getError]);
  // ---------------------------------------------------------------------------
  // const resetEvent = useEffectEvent(() => {
  //   setReset(true);
  //   setTimeout(() => {
  //     setReset(false);
  //   }, 50);
  // });
  useEffect(() => {
    if (Number(id) > 0) {
      getProduct(id);
    } 
    // else {
    //   resetEvent();
    // }
  }, [id]);
  if (isLoading || resetModal) {
    return <MoonLoader color="#bb1370" size={25} />;
  }
  return (
    <Modal show={true}>
      <MessageNotifier message={productMessage} onClose={closeModalError} />
      <Modal.Body>
        <SubmitForm
          fields={fields}
          onSubmit={handleSubmit}
          extraButtons={extraButtons}
          formTitle="اطلاعات محصول"
          defaultValues={Number(id) >0 ? productInfo : { DefaultSalePrice: 0 }}
          submitIcon={FaCheck}
          submitFormData={false}
          isPartial={true}
        />
      </Modal.Body>
    </Modal>
  );
}
