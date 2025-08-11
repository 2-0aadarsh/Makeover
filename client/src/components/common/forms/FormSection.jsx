/* eslint-disable react/prop-types */
import Input from "../../ui/Input";
import Button from "../../ui/Button";

const FormSection = ({
  title = "",
  description = "",
  inputData = [],
  formData = {},
  onInputChange,
  onSubmit,
  forgetPassword,
  buttonText = "Submit",
  inputcss = "",
  labelcss = "",
  buttoncss = "",
  error = "",
  isLoading = false,
}) => {
  return (
    <div className="flex flex-col gap-3 font-inter">
      {title && (
        <h2 className="title font-semibold text-[22px] text-[#CC2B52]">
          {title}
        </h2>
      )}

      {description && (
        <p className="text-sm text-[#313957] mb-4">{description}</p>
      )}

      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        {inputData.map((input, index) => (
          <Input
            key={`${input.id}-${index}`}
            labelName={input.labelName}
            type={input.type}
            id={input.id}
            name={input.id}
            placeholder={input.placeholder}
            value={formData[input.id] || ""}
            onChange={onInputChange}
            inputcss={inputcss}
            labelcss={labelcss}
            required={input.required}
          />
        ))}

        {forgetPassword && (
          <button
            type="button"
            className="text-[#000000] text-right text-sm font-medium underline -mt-2"
            onClick={forgetPassword}
          >
            Forgot Password?
          </button>
        )}

        <Button
          type="submit"
          content={isLoading ? "Processing..." : buttonText}
          css={`rounded-[26px] py-3 w-full ${buttoncss}`}
          disabled={isLoading}
          style={{ backgroundColor: "#CC2B52", color: "white" }}
        />

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default FormSection;
