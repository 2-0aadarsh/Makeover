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
  error = "",
}) => {
  return (
    <div className="flex flex-col font-inter">
      <div className="flex flex-col gap-2 mb-6">
        {title && (
          <h2 className="font-semibold text-xl sm:text-2xl lg:text-2xl text-gray-900">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
        )}
      </div>

      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        {inputData.map((input, index) => (
          <Input
            key={index}
            labelName={input.labelName}
            type={input.type}
            id={input.id}
            placeholder={input.placeholder}
            value={formData[input.id] || ""}
            onChange={onInputChange}
            inputcss={inputcss}
            labelcss={labelcss}
          />
        ))}

        {forgetPassword && (
          <button
            type="button"
            className="text-gray-600 font-inter text-xs font-medium underline flex justify-end -mt-2"
            onClick={forgetPassword}
          >
            Forget Password?
          </button>
        )}

        {error && <p className="text-sm text-red-500 -mt-1">{error}</p>}

        <div className="mt-4">
          <Button
            content={isLoading ? "Loading..." : buttonText}
            css="w-full rounded-xl py-3 text-sm font-medium"
            type="submit"
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};

export default FormSection;
