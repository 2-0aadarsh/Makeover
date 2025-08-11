/* eslint-disable no-unused-vars */
import FormHeader from './forms/FormHeader';
import FormSection from "./forms/FormSection";
import FormFooter from "./forms/FormFooter";

import loginHeader from '../../assets/loginHeader.jpg';
import { useState } from 'react';
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
import { useNavigate } from 'react-router-dom';



const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const { login, error, isLoading } = useLogin();

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const success = await login(formData);
    // if (success) navigate("/");
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };


  const [title, setTitle] = useState("Welcome Back Gorgeous  👋");
  const [description, setDescription] = useState("Sign in to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!");

=======

const LoginPage = () => {

  const [title, setTitle] = useState("Welcome Back Gorgeous  👋");
  const [description, setDescription] = useState("Sign in to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!");

>>>>>>> Stashed changes
=======

const LoginPage = () => {

  const [title, setTitle] = useState("Welcome Back Gorgeous  👋");
  const [description, setDescription] = useState("Sign in to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!");

>>>>>>> Stashed changes
=======

const LoginPage = () => {

  const [title, setTitle] = useState("Welcome Back Gorgeous  👋");
  const [description, setDescription] = useState("Sign in to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!");

>>>>>>> Stashed changes
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
    <div className="flex justify-center mt-20">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      <div className="w-[420px] flex flex-col  justify-between gap-3 p-9 rounded-md shadow-2xl">
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      <div className="w-96 flex flex-col  justify-between gap-3 p-4 rounded-md shadow-2xl">
>>>>>>> Stashed changes
        <FormHeader headerData={headerData} />

        <FormSection
          title={title}
          description={description}
          inputData={inputData}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          error="error"
          isLoading="isLoading"
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          forgetPassword={() =>
            alert("Forget Password functionality not implemented yet")
          }
          buttonText="Login"
        />

        <FormFooter
          accDetails="Don't you have an account?"
          switchToButton="Sign Up"
          switchTo="/signup"
        />
      </div>
    </div>
  );
}

export default LoginPage