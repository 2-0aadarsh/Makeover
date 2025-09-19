/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const Button = ({
  content,
  redirect,
  scrollTo,
  css,
  onClickFunction,
  icon,
}) => {
  const navigate = useNavigate();

  // Handles navigation if redirect is provided
  const handleClick = () => {
    if (redirect) {
      navigate(redirect);
    }
  };

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
      className={`bg-[#CC2B52] hover:bg-[#CC2B52]/90 transition-all duration-300 text-white flex items-center justify-center font-inter font-medium rounded-full px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 gap-1 sm:gap-2 min-w-fit text-xs sm:text-sm md:text-base ${css}`}
      onClick={onClickFunction ? onClickFunction : handleClick}
      tabIndex={0}
    >
      {content}
      {icon}
    </button>
  );
};

export default Button;
