/* eslint-disable no-unused-vars */
import { useState } from "react";
import FormSection from "./forms/FormSection";
import FormHeader from "./forms/FormHeader";
import signupHeader from "../../assets/signupHeader.jpg";
import FormFooter from "./forms/FormFooter";

const SignupPage = () => {
  const [title, setTitle] = useState("Create Your Account 👋");
  const [description, setDescription] = useState(
    "Sign Up to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!"
  );

  const headerData = [{ signupHeader: signupHeader, alt: "Signup Header" }];

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
      id: "number",
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
      id: "confirm-password",
      placeholder: "Confirm Your Password",
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
  );
};

export default SignupPage;
