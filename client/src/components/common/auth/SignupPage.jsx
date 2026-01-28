import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [formError, setFormError] = useState("");

  // Input handler
  const handleInputChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (formError) {
      setFormError("");
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.phoneNumber.trim()) {
      setFormError("Phone number is required.");
      return;
    }

    // Validate phone number format (Indian format: 10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phoneNumber.trim())) {
      setFormError(
        "Phone number must be 10 digits starting with 6, 7, 8, or 9"
      );
      return;
    }

    // Validate password format
    // eslint-disable-next-line no-useless-escape
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setFormError(
        "Password must be at least 8 characters with uppercase, number, and special character"
      );
      return;
    }

    // Check password match
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    setFormError("");
    console.log("📝 Submitting signup with data:", {
      ...formData,
      password: "***",
      confirmPassword: "***",
    });

    dispatch(signupUser(formData));
  };

  // react to signup success
  useEffect(() => {
    console.log("🔄 Signup success changed:", signupSuccess);
    if (signupSuccess) {
      console.log("✅ Signup successful! Navigating to verify-email page...");
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
      setFormError("");
      navigate("/auth/verify-email");
      console.log("🧭 Navigation to /auth/verify-email initiated");
      // Don't reset auth state here - let the verify-email page handle it on unmount
    }
  }, [signupSuccess, navigate]);

  // Static content
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
    <div className="w-full min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row shadow-xl rounded-2xl overflow-hidden bg-white">
        {/* LEFT FORM */}
        <div className="w-full lg:w-1/2 flex flex-col px-6 sm:px-8 lg:px-12 py-6 lg:py-8">
          <div className="mb-6 lg:mb-8">
            <Logo />
          </div>

          <FormSection
            title="Create Your Account 👋"
            description="Sign up to book your next glam session, track appointments, and unlock sweet beauty perks. Your glow-up is just a tap away!"
            inputData={inputData}
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            buttonText={status === "loading" ? "Signing Up..." : "Sign Up"}
            error={formError || error}
            isLoading={status === "loading"}
          />

          <div className="mt-6 lg:mt-8">
            <FormFooter
              accDetails="Already have an account?"
              switchToButton="Login"
              switchTo="/auth/login"
            />
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden lg:block lg:w-1/2">
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
