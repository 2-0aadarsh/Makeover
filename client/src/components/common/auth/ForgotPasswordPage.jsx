import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { forgetPasswordThunk } from "../../../features/auth/authThunks";
import { resetAuthState } from "../../../features/auth/AuthSlice";
import FormSection from "../forms/FormSection";
import Logo from "../../ui/Logo";

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { status, error, forgotPasswordSuccess } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ email: "" });

  const handleInputChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }
    dispatch(forgetPasswordThunk(formData.email));
  };

  useEffect(() => {
    if (status === "succeeded" && forgotPasswordSuccess) {
      toast.success("OTP sent to your email!");
      // here you might want to navigate to "reset-password" form
    } else if (status === "failed" && error) {
      toast.error(error);
    }

    return () => {
      dispatch(resetAuthState()); // cleanup on unmount
    };
  }, [status, error, forgotPasswordSuccess, dispatch]);

  const inputData = [
    {
      labelName: "Email",
      type: "email",
      id: "email",
      placeholder: "Enter your registered email",
    },
  ];

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-[600px] w-full p-6 sm:p-8 lg:p-10 shadow-xl rounded-2xl">
        <Logo />
        <FormSection
          title="Forgot Password?"
          description="Enter your email and we'll send you a reset OTP"
          inputData={inputData}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          buttonText={status === "loading" ? "Sending..." : "Send OTP"}
          isLoading={status === "loading"}
          error={error}
        />
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
