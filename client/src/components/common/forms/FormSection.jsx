/* eslint-disable react/prop-types */
import Button from "../../ui/Button";
import Input from "../../ui/Input";

const FormSection = ({
  title = "",
  description = "",
  inputData,
  forgetPassword,
  buttonText,
  inputcss,
  labelcss,
  formData,
  onInputChange,
  onSubmit,
  isLoading,
}) => {

   

  return (
    <div className="flex flex-col justify-evenly  font-inter  max-h-[800px] min-h-[350px] h-full">
      <div className="flex flex-col gap-1">
        {title && <h2 className="title font-semibold text-[32px]">{title}</h2>}
        {description && (
          <p className="text-[12px] text-[#313957]">{description}</p>
        )}
      </div>
      <form
        className="input-containers flex flex-col gap-6"
        onSubmit={onSubmit}
      >
        {inputData.map((input, index) => (
          <Input
            key={index}
            labelName={input.labelName}
            type={input.type}
            id={input.id}
            placeholder={input.placeholder}
            value={formData[input.id] || ""} // Controlled input
            onChange={onInputChange}
            inputcss={inputcss}
            labelcss={labelcss}
          />
        ))}

        {forgetPassword && (
          <button
            type="button"
            className="text-[#000000] font-inter text-[12px] font-semibold underline flex justify-end -mt-3"
            onClick={forgetPassword}
          >
            Forget Password?
          </button>
        )}

        <Button
          content={isLoading ? "Loading..." : buttonText}
          css="rounded-[26px] py-1 px-3"
          type="submit"
          disabled={isLoading}
          onClick={forgetPassword}
        />
      </form>
    </div>
  );
};

export default FormSection;
