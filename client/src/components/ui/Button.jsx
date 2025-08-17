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
        className={`py-2 px-4 bg-[#CC2B52] hover:bg-[#CC2B52]/90 transition-all duration-300 text-white rounded-sm flex items-center justify-center gap-2 text-sm cursor-pointer ${css}`}
      >
        {content}
        {icon}
      </ScrollLink>
    );
  }

  // Default button with redirect or onClick
  return (
    <button
      className={`py-2 px-4 bg-[#CC2B52] hover:bg-[#CC2B52]/90 transition-all duration-300 text-white rounded-sm flex items-center justify-center gap-2 text-sm ${css}`}
      onClick={onClickFunction ? onClickFunction : handleClick}
      tabIndex={0}
    >
      {content}
      {icon}
    </button>
  );
};

export default Button;
