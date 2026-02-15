/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { Loader2 } from "lucide-react";

const Button = ({
  content,
  redirect,
  scrollTo,
  css,
  onClickFunction,
  icon,
  type = "button",
  disabled = false,
  isLoading = false,
  ...rest
}) => {
  const navigate = useNavigate();

  // Handles navigation if redirect is provided
  const handleClick = () => {
    if (redirect) {
      navigate(redirect);
    }
  };

  const isDisabled = disabled || isLoading;

  // If scrollTo is provided, use react-scroll Link
  if (scrollTo) {
    return (
      <ScrollLink
        to={scrollTo}
        smooth={true}
        duration={500}
        offset={-50} // adjust for fixed navbar
        className={`bg-[#CC2B52] hover:bg-[#CC2B52]/90 transition-all duration-300 text-white flex items-center justify-center cursor-pointer font-inter font-semibold rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 gap-1 sm:gap-2 min-w-fit text-xs sm:text-sm md:text-base ${css}`}
      >
        {content}
        {icon}
      </ScrollLink>
    );
  }

  // Default button with redirect or onClick
  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`bg-[#CC2B52] transition-all duration-300 text-white flex items-center justify-center font-inter font-medium rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 gap-1 sm:gap-2 min-w-fit text-xs sm:text-sm md:text-base ${css} ${
        isDisabled
          ? "opacity-80 cursor-not-allowed"
          : "hover:bg-[#CC2B52]/90 cursor-pointer"
      }`}
      onClick={onClickFunction ? onClickFunction : handleClick}
      tabIndex={isDisabled ? -1 : 0}
      {...rest}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" aria-hidden />
          <span>{content}</span>
        </>
      ) : (
        <>
          {content}
          {icon}
        </>
      )}
    </button>
  );
};

export default Button;
