/* eslint-disable react/prop-types */
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FormFooter = ({ accDetails, switchToButton, switchTo }) => {
  const navigate = useNavigate();

  const handleSwitch = (switchTo) => {
    navigate(switchTo);
  };

  return (
    <div className="flex flex-col gap-4 font-inter">
      <div className="social-sign-in flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-[1px] w-2/5 bg-gray-200"></div>
          <p className="text-xs text-gray-500 px-2">or</p>
          <div className="h-[1px] w-2/5 bg-gray-200"></div>
        </div>

        <div className="social-sign-in-box flex items-center justify-between gap-3">
          <button className="social-item flex items-center justify-center gap-2 w-1/2 px-3 py-2.5 border border-gray-300 text-gray-700 font-medium text-xs rounded-lg hover:bg-gray-50 transition-colors">
            <FcGoogle className="text-lg" />
            <span>Google</span>
          </button>
          <button className="social-item flex items-center justify-center gap-2 w-1/2 px-3 py-2.5 border border-gray-300 text-gray-700 font-medium text-xs rounded-lg hover:bg-gray-50 transition-colors">
            <FaFacebookF className="text-lg text-blue-600" />
            <span>Facebook</span>
          </button>
        </div>
      </div>

      <div className="having-an-acc text-xs text-gray-600 text-center font-medium flex items-center justify-center gap-1">
        {accDetails}
        <span
          className="text-[#CC2B52] font-semibold cursor-pointer hover:underline"
          tabIndex={0}
          onClick={() => handleSwitch(switchTo)}
        >
          {switchToButton}
        </span>
      </div>

      <div className="copy-rights text-gray-400 text-[10px] text-center font-medium">
        © MAKEOVER 2025 ALL RIGHTS RESERVED
      </div>
    </div>
  );
};

export default FormFooter;
