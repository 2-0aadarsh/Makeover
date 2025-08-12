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

  return (
    <div className="flex justify-center mt-20">
<<<<<<< HEAD
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      <div className="w-[420px] flex flex-col  justify-between gap-3 p-9 rounded-md shadow-2xl">
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
      <div className="w-96 flex flex-col  justify-between gap-3 p-4 rounded-md shadow-2xl">
>>>>>>> Stashed changes
=======
      <div className="w-96 flex flex-col  justify-between gap-3 p-4 rounded-md shadow-2xl">
>>>>>>> parent of cd263de (fifth commit - designed opt verification)
        <FormHeader headerData={headerData} />

        <FormSection
          title={title}
          description={description}
          inputData={inputData}
<<<<<<< HEAD
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
          buttonText="Sign Up"
>>>>>>> Stashed changes
=======
          buttonText="Sign Up"
>>>>>>> Stashed changes
=======
          buttonText="Sign Up"
>>>>>>> Stashed changes
=======
          buttonText="Sign Up"
>>>>>>> parent of cd263de (fifth commit - designed opt verification)
        />
        <FormFooter
          accDetails="Have an account?"
          switchToButton="Login"
<<<<<<< HEAD
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          switchTo="/auth/login"
=======
          switchTo="/login"
>>>>>>> Stashed changes
=======
          switchTo="/login"
>>>>>>> Stashed changes
=======
          switchTo="/login"
>>>>>>> Stashed changes
=======
          switchTo="/login"
>>>>>>> Stashed changes
=======
          switchTo="/login"
>>>>>>> parent of cd263de (fifth commit - designed opt verification)
        />
      </div>
    </div>
  );
};

export default SignupPage;
