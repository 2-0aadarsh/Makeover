/* eslint-disable react/prop-types */
import Logo from "../../ui/Logo";

const FormHeader = ({ headerData }) => {
  return (
    <div className="flex flex-col gap-3 ">
      <Logo />
      <div className="img-container w-[343px] h-[120px] ">
        <img
          src={[...headerData][0].signupHeader}
          alt={[...headerData][0].alt }
          className="w-full h-full object-cover rounded-3xl"
        />
      </div>
    </div>
  );
};

export default FormHeader