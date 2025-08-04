/* eslint-disable no-unused-vars */
import FormHeader from './forms/FormHeader';
import FormSection from "./forms/FormSection";
import FormFooter from "./forms/FormFooter";

import loginHeader from '../../assets/loginHeader.jpg';
import { useState } from 'react';

const LoginPage = () => {
  const [title, setTitle] = useState("Welcome Back Gorgeous  👋");
  const [description, setDescription] = useState("Sign in to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!");

  const headerData = [{ url: loginHeader, alt: "Login Header" }];
  const inputData = [
    {
      labelName: "email",
      type: "email",
      id: "email",
      placeholder: "Enter Your Email",
    },
    {
      labelName: "password",
      type: "password",
      id: "password",
      placeholder: "Enter Your Password",
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
          forgetPassword={() =>
            alert("Forget Password functionality not implemented yet")
          }
          buttonText="Login"
        />

        <FormFooter
          accDetails="Don't you have an account?"
          switchTo="Sign Up"
        />
      </div>
    </div>
  );
}

export default LoginPage