import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// import FormHeader from "./forms/FormHeader";
import FormSection from "../forms/FormSection";
import FormFooter from "../forms/FormFooter";

import loginHeader from "../../../assets/loginHeader.jpg";
import { loginUser } from "../../../features/auth/authThunks";
import { resetAuthState } from "../../../features/auth/AuthSlice";
import Logo from "../../ui/Logo";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { status, error, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set local loading state immediately
    dispatch(loginUser(formData));
  };

  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };

  // react to auth state - Wait for all state to update before redirecting
  useEffect(() => {
    // Only proceed if login succeeded AND user data is fully loaded
    if (status === "succeeded" && isAuthenticated && user) {
      // Wait for role to be available (backend includes it)
      if (user.role) {
        toast.success("Login successful");
        setFormData({ email: "", password: "" });
        setIsSubmitting(false); // Clear loading state on success

        // Check user role and redirect accordingly
        if (user.role === "admin") {
          console.log("✅ Admin user detected, redirecting to admin dashboard");
          navigate("/admin/dashboard", { replace: true });
        } else {
          console.log("✅ Regular user detected, redirecting to homepage");
          navigate("/", { replace: true });
        }
      } else {
        console.log("⏳ Waiting for user role to be loaded...");
      }
    }
    
    // Clear loading state when there's an error
    if (status === "failed") {
      setIsSubmitting(false);
    }
  }, [status, error, isAuthenticated, user, navigate]);

  // Clear auth error when navigating away from login page
  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

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
      <div className="w-full max-w-[1440px] min-h-[600px] lg:h-[700px] flex flex-col lg:flex-row shadow-xl rounded-2xl overflow-hidden">
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
            buttonText={isSubmitting ? "Logging in..." : "Log in"}
            disabled={isSubmitting}
            error={error}
            isLoading={isSubmitting}
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
