import {
  useEffect,
  useState,
  useEffectEvent,
  useRef,
  startTransition,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiModalResultType } from "../../utils/apiHelper";
import MessageNotifier from "../../components/MessageNotifier";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import {
  useCreateMutation,
  useLazyGetQuery,
  useLazyGetSimilarNamePeopleQuery,
  useUpdateMutation,
} from "../../store/person/personApi";
import { MoonLoader } from "react-spinners";
import SubmitForm from "../../components/form/SubmitForm";
import Modal from "../../components/Modal";
import { keyIsLetterOrNumber } from "../../utils/commonFunctions";

export default function Person() {
  const { id } = useParams();
  const debounceRef = useRef(null);
  const navigate = useNavigate();
  const [resetModal, setResetModal] = useState(false);
  const [personMessage, setPersonMessage] = useState(null);

  const [create, { error: createError }] = useCreateMutation();
  const [update, { error: updateError }] = useUpdateMutation();
  const [getPerson, { data: personInfo, error: getError, isLoading, reset }] =
    useLazyGetQuery();
  const [getSimilarName, { data: similarInfo, reset: resetSimilarInfo }] =
    useLazyGetSimilarNamePeopleQuery();

  const handleSerialKeyDown = (e) => {
    const char = e.key?.toLowerCase() ?? "";
    const lastChar =
      e.target.value && e.target.value.length > 0
        ? e.target.value[e.target.value.length - 1]
        : "";
    const exceptionArray = [
      "enter",
      "alt",
      "shift",
      "control",
      "tab",
      "capslock",
      "backspace",
    ];
    if (!exceptionArray.includes(char))
      if (!keyIsLetterOrNumber(e.key, false, false)) {
        e.preventDefault();
        if (lastChar !== "," && lastChar !== "") e.target.value += ",";
      }
  };
  const handlePersonNameKeyDown = (e) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      startTransition(() => {
        if (e.target.value?.length >= 3) getSimilarName(e.target.value);
        else if (similarInfo?.list?.length > 0) {
          resetSimilarInfo();
        }
      });
    }, 500);
  };
  const fields = [
    { name: "ID", title: "", type: "hidden" },
    { name: "IsCustomer", title: "", type: "hidden" },
    // {
    //   name: "PersonCode",
    //   title: "کد مشتری",
    //   type: "number",
    //   len: "md:12",
    //   parentClassName: Number(id) > 0 ? "" : "hidden",
    // },
    {
      name: "PersonName",
      title: "نام مشتری",
      type: "text",
      len: "md:12",
      required: "نام مشتری الزامی است",
      onKeyDown: handlePersonNameKeyDown,
    },
    {
      name: "CallerName",
      title: "نام تماس گیرنده",
      type: "text",
      len: "md:12",
      required: "نام تماس گیرنده الزامی است",
    },
    {
      name: "Mobile",
      title: "شماره همراه",
      type: "number",
      len: "md:12",
    },
    {
      name: "Phone",
      title: "شماره تلفن",
      type: "number",
      len: "md:12",
    },
    {
      name: "ProductSerials",
      title: "سریال محصولات",
      type: "text",
      len: "md:12",
      onKeyDown: handleSerialKeyDown,
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
    setPersonMessage(null);
  }

  const handleSubmit = async (data) => {
    if (Number(id) > 0) {
      await update(data).unwrap();
    } else {
      data.PersonCode = 0;
      data.IsCustomer = true;
      data.ID = 0;
      const result = await create(data).unwrap();
      //if (result.data) navigate(`/person/${result.data.id}`);
      reset();
      setResetModal(true);
      setTimeout(() => {
        setResetModal(false);
      }, [50]);
    }
    setPersonMessage({
      text: "ثبت/ویرایش اطلاعات مشتری با موفقیت انجام شد",
      title: "ثبت اطلاعات مشتری",
      type: apiModalResultType.info,
    });
  };
  // ----------- استفاده از useEffectEvent برای جلوگیری از هشدار -------------
  const showErrorMessage = useEffectEvent((errorText) => {
    setPersonMessage({
      type: apiModalResultType.error,
      text: errorText,
      title: "ثبت/ویرایش مشتری",
    });
  });
  const navigateToPerson = (id) => {
    navigate(`/person/${id}`);
  };
  // وقتی createError تغییر کند، این effect اجرا می‌شود
  useEffect(() => {
    const errorMessage = createError || updateError || getError;
    if (errorMessage) {
      showErrorMessage(errorMessage);
    }
  }, [createError, updateError, getError]);
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (Number(id) > 0) {
      getPerson(id);
    }
    resetSimilarInfo();
  }, [id]);
  if (isLoading || resetModal) {
    return <MoonLoader color="#bb1370" size={25} />;
  }
  return (
    <Modal show={true}>
      <MessageNotifier message={personMessage} onClose={closeModalError} />
      <Modal.Body>
        <SubmitForm
          fields={fields}
          onSubmit={handleSubmit}
          extraButtons={extraButtons}
          formTitle="اطلاعات مشتری"
          defaultValues={personInfo || {}}
          submitIcon={FaCheck}
          submitFormData={false}
          isPartial={true}
        />
        {similarInfo?.list?.length > 0 && (
          <div className="">
            <label className="font-bold mt-1">
              مشتری های مشابه:
            </label>
            <div className="border rounded border-cyan-700 p-1 mt-0.5 relative max-h-[150px] overflow-auto scroll-thin">
              <table className="border-separate border-spacing-0 whitespace-normal table-fixed w-full">
                <tbody>
                  {similarInfo.list.map((info, i) => (
                    <tr
                      key={i}
                      className="cursor-pointer hover:bg-cyan-800 hover:text-white rounded"
                      onClick={() => navigateToPerson(info.id)}
                    >
                      <td className="p-0.5 rounded-r max-w-1/4 wrap-break-word">
                        {info.personName}
                      </td>
                      <td className="p-0.5 rounded-l max-w-3/4 wrap-break-word">
                        {info.productSerials}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
