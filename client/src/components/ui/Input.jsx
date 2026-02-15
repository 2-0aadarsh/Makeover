/* eslint-disable react/prop-types */
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({
  labelName,
  type,
  id,
  placeholder,
  value,
  onChange,
  inputcss,
  labelcss,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    if (disabled) return;
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="input flex flex-col gap-2 font-inter relative">
      <label
        htmlFor={id}
        className={`text-xs sm:text-sm capitalize ml-1 ${labelcss}`}
      >
        {labelName}
      </label>

      <input
        type={isPassword && showPassword ? "text" : type}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full py-2 sm:py-3 px-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC2B52] text-sm sm:text-base ${inputcss} ${
          disabled ? "bg-gray-50 cursor-not-allowed opacity-90" : ""
        }`}
        placeholder={placeholder}
      />

      {isPassword && (
        <span
          onClick={togglePasswordVisibility}
          className="absolute right-3 sm:right-5 top-[65%] sm:top-[69%] transform -translate-y-1/2 cursor-pointer text-gray-500"
        >
          {showPassword ? (
            <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" />
          ) : (
            <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
          )}
        </span>
      )}
    </div>
  );
};

export default Input;
