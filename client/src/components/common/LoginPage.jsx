
import { useState } from "react";
import FormSection from "./forms/FormSection";
import FormHeader from "./forms/FormHeader";
import loginHeader from "../../assets/loginHeader.jpg";
import FormFooter from "./forms/FormFooter";

const LoginPage = () => {
const [title, setTitle] = useState("Welcome Back Gorgeous 👋");
  const [description, setDescription] = useState(
    "Sign in to book your next glam session , track appointments , and unlock sweet beauty perks. Your glow-up is just a tap away!"
  );

  const headerData = [{ loginHeader: loginHeader, alt: "Login Header" }];

  const inputData = [
    {
      labelName: "Email/Mobile No.",
      type: "text",
      id: "Email/Mobile No.",
      placeholder: "Enter Your email or mobile number",
    },
    {
      labelName: "password",
      type: "password",
      id: "password",
      placeholder: "At least 8 characters",
    },
  ];

  return (
    <div className="flex justify-center ">
      <div className="w-96 flex flex-col  justify-between gap-3 p-4 rounded-md shadow-2xl">
        <FormHeader headerData={headerData} />

        <FormSection
          title={title}
          description={description}
          inputData={inputData}
        />
        <FormFooter />
        
      </div>
    </div>
  )
}

export default LoginPage