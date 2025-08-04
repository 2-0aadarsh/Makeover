/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";

const Button = ({ content, redirect, css, onClickFunction }) => {
  const navigate = useNavigate(); // redirect here

  const handleClick = () => {
    navigate(redirect);
  };

  return (
    <button
      className={`py-2 px-4 bg-[#CC2B52] text-white rounded-sm text-sm ${css}`}
      onClick={onClickFunction ? onClickFunction : handleClick}
      tabIndex={0}
    >
      {content}
    </button>
  );
};

export default Button;
