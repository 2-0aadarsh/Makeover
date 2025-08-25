import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Logo from "../../components/ui/Logo";
import { resetAuthState } from "../../features/auth/AuthSlice";
import { resetPasswordThunk } from "../../features/auth/authThunks";
import FormSection from "../../components/common/forms/FormSection";

const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const { status, error, resetPasswordSuccess } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Get token and id from query params
  const { id, token } = useParams();

  const handleInputChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or expired reset link");
      return;
    }

    dispatch(
      resetPasswordThunk({
        id,
        token,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })
    );
  };

  useEffect(() => {
    if (status === "succeeded" && resetPasswordSuccess) {
      navigate("/");
    } else if (status === "failed" && error) {
      toast.error(error);
    }

    return () => {
      dispatch(resetAuthState());
    };
  }, [status, error, resetPasswordSuccess, dispatch, navigate]);

  const inputData = [
    {
      labelName: "New Password",
      type: "password",
      id: "password",
      placeholder: "Enter new password",
    },
    {
      labelName: "Confirm Password",
      type: "password",
      id: "confirmPassword",
      placeholder: "Confirm new password",
    },
  ];

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-[600px] w-full p-10 shadow-xl rounded-2xl">
        <Logo />
        <FormSection
          title="Reset Password"
          description="Enter your new password to reset your account"
          inputData={inputData}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          buttonText={status === "loading" ? "Resetting..." : "Reset Password"}
          isLoading={status === "loading"}
          error={error}
        />
      </div>
    </div>
  );
};

export default ResetPasswordPage;