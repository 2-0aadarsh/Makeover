import { useState } from "react";
import { useNavigate } from "react-router-dom";

import FormHeader from "./forms/FormHeader";
import FormSection from "./forms/FormSection";
import FormFooter from "./forms/FormFooter";

import signupHeader from "../../assets/signupHeader.jpg";
import useSignup from "../../hooks/useSignup";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, error, isLoading } = useSignup();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Input handler
  const handleInputChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await signup(formData);
    if (success) {
      // clear form after signup
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      })

      navigate("/auth/verify-email", { state: { userEmail: formData.email } });
    }
  }

  // Static content
  const headerData = [{ url: signupHeader, alt: "Signup Header" }];
  const inputData = [
    {
      labelName: "Name",
      type: "text",
      id: "name",
      placeholder: "Enter your name",
    },
    {
      labelName: "Email",
      type: "email",
      id: "email",
      placeholder: "Enter your email",
    },
    {
      labelName: "Phone Number",
      type: "number",
      id: "phoneNumber",
      placeholder: "Enter your phone number",
    },
    {
      labelName: "Password",
      type: "password",
      id: "password",
      placeholder: "Enter your password",
    },
    {
      labelName: "Confirm Password",
      type: "password",
      id: "confirmPassword",
      placeholder: "Confirm your password",
    },
  ];

  return (
    <div className="flex justify-center mt-20">
      <div className="w-[420px] flex flex-col gap-3 p-9 rounded-md shadow-2xl">
        {/* Header Image */}
        <FormHeader headerData={headerData} />

        {/* Signup Form */}
        <FormSection
          title="Create Your Account 👋"
          description="Sign up to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!"
          inputData={inputData}
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          buttonText="Sign Up"
          error={error}
          isLoading={isLoading}
        />

        {/* Footer */}
        <FormFooter
          accDetails="Have an account?"
          switchToButton="Login"
          switchTo="/auth/login"
        />
      </div>
    </div>
  );
};

export default SignupPage;
