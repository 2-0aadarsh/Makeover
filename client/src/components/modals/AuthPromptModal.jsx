import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const AuthPromptModal = ({
  isOpen,
  onClose,
  onLogin,
  onSignup,
  title = "Sign In Required",
  message = "Before proceeding to payment, please sign in. If you don't have an account yet, you can create one in a minute and your cart will be saved.",
  loginLabel = "Sign In to Continue",
  signupLabel = "Create Account",
}) => {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleLogin = () => {
    if (onLogin) {
      onLogin();
    } else {
      navigate("/auth/login");
    }
    if (onClose) {
      onClose();
    }
  };

  const handleSignup = () => {
    if (onSignup) {
      onSignup();
    } else {
      navigate("/auth/signup");
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition-colors duration-200 hover:text-gray-600"
          aria-label="Close authentication prompt"
        >
          ×
        </button>

        <div className="mt-2 flex flex-col gap-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#CC2B52]/10 text-[#CC2B52]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0115 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.5-1.632z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleLogin}
              className="w-full rounded-lg bg-[#CC2B52] py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#B02547]"
            >
              {loginLabel}
            </button>
            <div className="text-sm text-gray-700">
              Don't have an account?{" "}
              <button
                onClick={handleSignup}
                className="font-semibold text-[#CC2B52] underline-offset-4 transition-colors duration-200 hover:text-[#B02547] hover:underline"
              >
                {signupLabel}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Your cart items stay saved—signing in helps us personalize your booking experience.
          </p>
        </div>
      </div>
    </div>
  );
};

AuthPromptModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  onLogin: PropTypes.func,
  onSignup: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  loginLabel: PropTypes.string,
  signupLabel: PropTypes.string,
};

export default AuthPromptModal;



