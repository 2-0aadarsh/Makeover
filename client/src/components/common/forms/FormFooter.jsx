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
    <div className="flex flex-col gap-3 sm:gap-4 py-4 font-inter">
      <div className="social-sign-in flex flex-col gap-3 sm:gap-4">
        <div className="flex items-center justify-between">
          <div className="h-[1px] w-2/5 bg-[#CFDFE2]"></div>
          <p className="text-xs sm:text-sm">or</p>
          <div className="h-[1px] w-2/5 bg-[#CFDFE2]"></div>
        </div>

        <div className="social-sign-in-box flex items-center justify-between gap-3 sm:gap-4">
          <button className="social-item flex items-center justify-center gap-2 sm:gap-3 w-1/2 px-2 py-2 sm:py-3 border-[1px] border-[#E8E8E8] text-[#313957] font-[400] text-xs sm:text-sm rounded-lg">
            <FcGoogle className="text-xl sm:text-2xl" />
            <p>Google</p>
          </button>
          <button className="social-item flex items-center justify-center gap-2 sm:gap-3 w-1/2 px-2 py-2 sm:py-3 border-[1px] border-[#E8E8E8] text-[#313957] font-[400] text-xs sm:text-sm rounded-lg">
            <FaFacebookF className="text-xl sm:text-2xl" />
            <p>Facebook</p>
          </button>
        </div>
      </div>

      <div className="having-an-acc text-xs sm:text-sm text-[#313957] text-center font-[400] flex items-center justify-center gap-1">
        {accDetails}
        <span
          className="text-[#CC2B52] font-medium cursor-pointer"
          tabIndex={0}
          onClick={() => handleSwitch(switchTo)}
        >
          {switchToButton}
        </span>
      </div>

      <div className="copy-rights text-[#959CB6] text-[10px] sm:text-[12px] text-center font-[400]">
        © MAKEOVER 2025 ALL RIGHTS RESERVED
      </div>
    </div>
  );
};

export default FormFooter;
