/* eslint-disable no-unused-vars */
import { useState } from "react";
import FormSection from "./forms/FormSection";
import FormHeader from "./forms/FormHeader";
import signupHeader from "../../assets/signupHeader.jpg";
import FormFooter from "./forms/FormFooter";
import { useNavigate } from "react-router-dom";
import useSignup from "../../hooks/useSignup";

const SignupPage = () => {
  const [title, setTitle] = useState("Create Your Account 👋");
  const [description, setDescription] = useState(
    "Sign Up to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!"
  );

  const headerData = [{ url: signupHeader, alt: "Signup Header" }];

  const inputData = [
    {
      labelName: "name",
      type: "text",
      id: "name",
      placeholder: "Enter Your Name",
    },
    {
      labelName: "email",
      type: "email",
      id: "email",
      placeholder: "Enter Your Email",
    },
    {
      labelName: "phone number",
      type: "number",
      id: "phoneNumber",
      placeholder: "Enter Your Phone Number",
    },
    {
      labelName: "password",
      type: "password",
      id: "password",
      placeholder: "Enter Your Password",
    },
    {
      labelName: "confirm password",
      type: "password",
      id: "confirmPassword",
      placeholder: "Confirm Your Password",
    },
  ];

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

   const { signup, error, isLoading } = useSignup();

   const handleInputChange = (e) => {
     const { id, value } = e.target;
     setFormData((prev) => ({ ...prev, [id]: value }));
   };

   const handleSubmit = async (e) => {  
     e.preventDefault();
     const success = await signup(formData);
     if (success) navigate("/auth/verify-email", { state: { userEmail: formData.email } });
   };

  return (
    <div className="flex justify-center mt-20">
<<<<<<< Updated upstream
      <div className="w-[420px] flex flex-col  justify-between gap-3 p-9 rounded-md shadow-2xl">
=======
      <div className="w-96 flex flex-col  justify-between gap-3 p-4 rounded-md shadow-2xl">
>>>>>>> Stashed changes
        <FormHeader headerData={headerData} />

        <FormSection
          title="Create Your Account 👋"
          description="Sign Up to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!"
          inputData={inputData}
<<<<<<< Updated upstream
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          buttonText="Sign Up"
          error={error}
          isLoading={isLoading}
=======
          buttonText="Sign Up"
>>>>>>> Stashed changes
        />
        <FormFooter
          accDetails="Have an account?"
          switchToButton="Login"
<<<<<<< Updated upstream
          switchTo="/auth/login"
=======
          switchTo="/login"
>>>>>>> Stashed changes
        />
      </div>
    </div>
  );
};

export default SignupPage;
