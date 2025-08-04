/* eslint-disable react/prop-types */

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; 

const Input = ({ labelName, type, id, placeholder, value, onChange }) => {
   const [showPassword, setShowPassword] = useState(false);
   const isPassword = type === "password";

   const togglePasswordVisibility = () => {
     setShowPassword((prev) => !prev);
   };

  return (
    <div className="input flex flex-col gap-1 font-inter relative">
      <label htmlFor={id} className="text-sm capitalize ml-1">
        {labelName}
      </label>
      <input
        type={type}
        id={id}
        value={value} // Controlled component
        onChange={onChange}
        className="w-full p-1 px-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CC2B52]"
        placeholder={placeholder}
      />

      {isPassword && (
        <span
          onClick={togglePasswordVisibility}
          className="absolute right-5 top-[69%] transform -translate-y-1/2 cursor-pointer text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </span>
      )}
    </div>
  );
};

export default Input