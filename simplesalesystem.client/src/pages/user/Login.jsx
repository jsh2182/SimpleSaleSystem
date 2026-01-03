import { useForm } from "react-hook-form";
import InputField from "../../components/form/InputField";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { useLoginUserMutation } from "../../store/user/userAPI";
import Button, { buttonBgVariants } from "../../components/Button";
import { apiModalResultType } from "../../utils/apiHelper";
import MessageNotifier from "../../components/MessageNotifier";
import { Link } from "react-router-dom";
// import { clearError } from "../../store/user/userSlice";
import { RiLockPasswordLine } from "react-icons/ri";
import { useState } from "react";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //const { loading, error } = useSelector((state) => state.user);
  const [loginUser, { isLoading: loginLoading, error }] =
    useLoginUserMutation();
  const [loginError, setLoginError] = useState({
    type: apiModalResultType.error,
    text: error,
    title: "ورود به سیستم",
  });
  const handleLogin = async (data) => {
    try {
      await loginUser(data).unwrap();
    } catch (err) {
      setLoginError({
        type: apiModalResultType.error,
        text: err,
        title: "ورود به سیستم",
      });
    }
  };

  function closeModalError() {
    setLoginError(null);
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-linear-[180deg] from-[#c5e6eb] to-white w-full">
        <div className="w-11/12 sm:w-3/4 md:w-1/2 lg:w-2/5 min-w-[320px] mx-auto p-8 bg-[#00000002] outline-1 outline-blue-50 rounded-lg shadow-md relative">
          <h2 className="mb-6 text-2xl font-semibold text-center text-cyan-900">
            ورود
          </h2>
          <MessageNotifier message={loginError} onClose={closeModalError} />
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="space-y-4"
            noValidate
          >
            <InputField
              name="username"
              type="text"
              // inputMode="numeric"
              label="نام کاربری"
              icon={FaUser}
              register={register}
              rtl={true}
              validation={{
                required: "نام کاربری الزامی است" /*,
              pattern: {
                value: /^\S+@\S+$/i,
                message: "فرمت ایمیل معتبر نیست",
              },*/,
              }}
              error={errors.username?.message}
            />
            <InputField
              name="password"
              type="password"
              label="رمز عبور"
              rtl={true}
              icon={FaLock}
              register={register}
              validation={{
                required: "رمز عبور الزامی است",
                minLength: {
                  value: 4,
                  message: "رمز عبور باید حداقل 4 کاراکتر باشد",
                },
              }}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              text="ورود"
              color={buttonBgVariants.F7BE38}
              isLoading={loginLoading}
              icon={FaSignInAlt}
              classNames="me-2"
              fullWidth={true}
            ></Button>
          </form>
        </div>
      </div>
    </>
  );
}
