import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// import FormHeader from "./forms/FormHeader";
import FormSection from "../forms/FormSection";
import FormFooter from "../forms/FormFooter";

import signupHeader from "../../../assets/signupHeader.jpg";
import Logo from "../../ui/Logo";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../../features/auth/authThunks";
import { resetAuthState } from "../../../features/auth/AuthSlice";

const SignupPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status, error, signupSuccess } = useSelector((state) => state.auth);

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
    dispatch(signupUser(formData));
  };

  // react to signup success
  useEffect(() => {
    if (signupSuccess) {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
      navigate("/auth/verify-email");
      dispatch(resetAuthState()); // cleanup after redirect
    }
  }, [signupSuccess, navigate, formData.email, dispatch]);

  // Static content
  // const headerData = [{ url: signupHeader, alt: "Signup Header" }];
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
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-[1240px] h-[960px] flex shadow-xl">
        {/* LEFT FORM */}
        <div className="md:w-1/2 w-[468px] flex flex-col justify-between px-20 py-6">
          <Logo />

          <FormSection
            title="Create Your Account 👋"
            description="Sign up to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!"
            inputData={inputData}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            buttonText={status === "loading" ? "Signing Up..." : "Sign Up"}
            error={error}
            isLoading={status === "loading"}
          />

          <FormFooter
            accDetails="Already have an account?"
            switchToButton="Login"
            switchTo="/auth/login"
          />
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden rounded-3xl  overflow-hidden  md:block w-1/2">
          <img
            src={signupHeader}
            alt="Signup Glam"
            loading="lazy"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
