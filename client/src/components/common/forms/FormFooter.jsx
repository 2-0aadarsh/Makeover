import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

const FormFooter = () => {
  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="social-sign-in flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="h-[1px] w-2/5 bg-[#CFDFE2]"></div>
          <p>or</p>
          <div className="h-[1px] w-2/5 bg-[#CFDFE2]"></div>
        </div>

        <div className="social-sign-in-box flex items-center justify-between gap-4">
          <button className="social-item flex items-center justify-center gap-3 w-1/2 px-2 py-3  border-[1px] border-[#E8E8E8] text-[#313957] font-[400] text-sm">
            <FcGoogle className="text-2xl" />
            <p>Google</p>
          </button>
          <button className="social-item flex items-center justify-center gap-3 w-1/2 px-2 py-3  border-[1px] border-[#E8E8E8] text-[#313957] font-[400] text-sm">
            <FaFacebookF className="text-2xl" />
            <p>Facebook</p>
          </button>
        </div>
      </div>
      <div className="having-an-acc text-sm text-[#313957] text-center font-[400]">
        Have an account?{" "}
        <span className="text-[#CC2B52] font-medium" tabIndex={0}>
          Login
        </span>
      </div>
      <div className="copy-rights text-[#959CB6] text-[12px] text-center font-[400]">
        © MAKEOVER 2025 ALL RIGHTS RESERVED
      </div>
    </div>
  );
};

export default FormFooter;
