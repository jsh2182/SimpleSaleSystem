import { useEffect, useState, useEffectEvent } from "react";
import { useNavigate } from "react-router-dom";
import { apiModalResultType } from "../../utils/apiHelper";
import MessageNotifier from "../../components/MessageNotifier";
import { FaCheck } from "react-icons/fa";
import SubmitForm from "../../components/form/SubmitForm";
import Modal from "../../components/Modal";
import { useUpdateMeMutation } from "../../store/user/userAPI";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const user = useSelector((state) => state.user.currentUser);
  const userData = { UserFullName: user.full_name, UserName: user.uName };

  const [update, { error: updateError }] = useUpdateMeMutation();
  const navigate = useNavigate();
  const [productMessage, setProductMessage] = useState(null);
  const fields = [
    { name: "ID", title: "", type: "hidden" },
    {
      name: "UserFullName",
      title: "نام کامل کاربر",
      type: "text",
      len: "md:12",
      required: "نام کامل کاربر الزامی است",
      readOnly: true,
    },
    {
      name: "UserName",
      title: "نام کاربری",
      type: "text",
      len: "md:12",
      required: "نام کاربری الزامی است",
      pattern:/^[A-Za-z0-9\s.,!?-]*$/,
      patternMessage:"تنها حروف انگلیسی مجاز است."
    },
    {
      name: "Password",
      title: "رمز عبور",
      type: "password",
      len: "md:12",
      minLength: {
        value: 4,
        message: "رمز عبور باید حداقل 4 کاراکتر باشد",
      },
    },
  ];

  function closeModalError() {
    setProductMessage(null);
  }

  const handleSubmit = async (data) => {
    data.ID = 0;
    await update(data).unwrap();
    setProductMessage({
      text: "عملیات با موفقیت انجام شد",
      title: "ویرایش اطلاعات",
      type: apiModalResultType.info,
    });
  };
  // ----------- استفاده از useEffectEvent برای جلوگیری از هشدار -------------
  const showErrorMessage = useEffectEvent((errorText) => {
    setProductMessage({
      type: apiModalResultType.error,
      text: errorText,
      title: "ویرایش اطلاعات",
    });
  });

  // وقتی createError تغییر کند، این effect اجرا می‌شود
  useEffect(() => {
    if (updateError) {
      showErrorMessage(updateError);
    }
  }, [updateError]);
  // ---------------------------------------------------------------------------
  return (
    <Modal show={true} size="" onClose={() => navigate(-1)}>
      <Modal.Header>اطلاعات کاربری من</Modal.Header>
      <MessageNotifier message={productMessage} onClose={closeModalError} />
      <Modal.Body>
        <SubmitForm
          fields={fields}
          onSubmit={handleSubmit}
          defaultValues={userData}
          submitIcon={FaCheck}
          submitFormData={false}
          isPartial={true}
        />
      </Modal.Body>
    </Modal>
  );
}
