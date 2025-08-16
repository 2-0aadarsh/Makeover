/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormHeader from "./forms/FormHeader";
import FormSection from "./forms/FormSection";
import FormFooter from "./forms/FormFooter";

import loginHeader from "../../assets/loginHeader.jpg";
// import useLogin from "../../hooks/useLogin"; // Uncomment when hook is ready

const LoginPage = () => {
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({ email: "", password: "" });

  // const { login, error, isLoading } = useLogin(); // Hook integration

  // Generic input change handler
  const handleInputChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // const success = await login(formData);
    // if (success) {
    //   // ✅ clear form after login
    //   setFormData({ email: "", password: "" });

    //   // ✅ redirect to homepage (or dashboard)
    //   navigate("/");
    // }
  };

  // Forgot password navigation
  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  // Static page content
  const headerData = [{ url: loginHeader, alt: "Login Header" }];
  const inputData = [
    {
      labelName: "Email",
      type: "email",
      id: "email",
      placeholder: "Enter your email",
    },
    {
      labelName: "Password",
      type: "password",
      id: "password",
      placeholder: "Enter your password",
    },
  ];

  return (
    <div className="flex justify-center mt-20">
      <div className="w-[420px] flex flex-col gap-3 p-9 rounded-md shadow-2xl">
        {/* Header Image */}
        <FormHeader headerData={headerData} />

        {/* Login Form */}
        <FormSection
          title="Welcome Back Gorgeous 👋"
          description="Sign in to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!"
          inputData={inputData}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          forgetPassword={handleForgotPassword}
          buttonText="Login"
          // error={error}
          // isLoading={isLoading}
        />

        {/* Footer */}
        <FormFooter
          accDetails="Don't have an account?"
          switchToButton="Sign Up"
          switchTo="/signup"
        />
      </div>
    </div>
  );
};

export default LoginPage;
