/* eslint-disable react/prop-types */
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const FormSection = ({ title, description, inputData }) => {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="title font-semibold text-[22px]">{title}</h2>
      <p className="text-[12px] text-[#313957]">{description}</p>

      <form className="input-containers flex flex-col gap-6">
        {inputData.map((input, index) => (
          <Input
            key={index}
            labelName={input.labelName}
            type={input.type}
            id={input.id}
            placeholder={input.placeholder}
          />
        ))}

        <Button
          content="Sign Up"
          css="rounded-[26px] py-1 px-3 hover:bg-[#CC2B52]/90 transition-all duration-300"
          onClickFunction={(e) => {
            e.preventDefault(); // To prevents the default form submission and refreshing the page
            console.log("Signup");
          }}
        />
      </form>
    </div>
  );
};

export default FormSection;
