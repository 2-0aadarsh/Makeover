import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

// import FormHeader from "./forms/FormHeader";
import FormSection from "../forms/FormSection";
import FormFooter from "../forms/FormFooter";

import loginHeader from "../../../assets/loginHeader.jpg";
import { loginUser } from "../../../features/auth/authThunks";
import Logo from "../../ui/Logo";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  // react to auth state
  useEffect(() => {
    if (status === "succeeded" && isAuthenticated) {
      toast.success("Login successful");
      setFormData({ email: "", password: "" });
      navigate("/");
    } else if (status === "failed" && error) {
      toast.error(error);
    }
  }, [status, error, isAuthenticated, navigate]);

  // const headerData = [{ url: loginHeader, alt: "Login Header" }];
  const inputData = [
    {
      labelName: "Email/Mobile No.",
      type: "email",
      id: "email",
      placeholder: "Enter your email or mobile number",
    },
    {
      labelName: "Password",
      type: "password",
      id: "password",
      placeholder: "At least 8 characters",
    },
  ];

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[1440px] min-h-[600px] lg:h-[800px] flex flex-col lg:flex-row shadow-xl rounded-2xl overflow-hidden">
        {/* LEFT: Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between px-4 sm:px-8 lg:px-20 py-6 lg:py-6">
          <Logo />

          <FormSection
            title="Welcome Back Gorgeous 👋"
            description="Sign in to book your next glam session, track appointments, and unlock sweet beauty perks."
            inputData={inputData}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            forgetPassword={handleForgotPassword}
            buttonText={status === "loading" ? "Logging in..." : "Log in"}
            disabled={status === "loading"}
            error={error}
            isLoading={status === "loading"}
          />

          <FormFooter
            accDetails="Don't you have an account?"
            switchToButton="Sign up"
            switchTo="/auth/signup"
          />
        </div>

        {/* RIGHT: Image */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src={loginHeader}
            alt="Login Visual"
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
