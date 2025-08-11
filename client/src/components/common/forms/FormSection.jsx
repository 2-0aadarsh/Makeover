/* eslint-disable react/prop-types */
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
import { useState } from "react";
import useSignup from "../../../hooks/useSignup";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useNavigate } from "react-router-dom";

const FormSection = ({ title='', description='', inputData, forgetPassword, buttonText, inputcss, labelcss }) => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, error } = useSignup(); // useSignup returns signup function and error state

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await signup(formData);
    if (response) {
      // clear form data on successful signup
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });
      // Then we can redirect to HomePage
      navigate("/")
    }
  };

  return (
    <div className="flex flex-col gap-3 font-inter">
      <h2 className="title font-semibold text-[22px]">{title}</h2>
      <p className="text-[12px] text-[#313957]">{description}</p>

      <form
        className="input-containers flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
        {inputData.map((input, index) => (
          <Input
            key={`${input.id}-${index}`}
            labelName={input.labelName}
            type={input.type}
            id={input.id}
            name={input.id}
            placeholder={input.placeholder}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
            value={formData[input.id] || ""}
            onChange={onInputChange}
            inputcss={inputcss}
            labelcss={labelcss}
            required={input.required}
=======
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
            value={formData[input.id]} // Controlled input
            onChange={handleChange}
            inputcss={inputcss}
            labelcss={labelcss}
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          />
        ))}
        {forgetPassword && (
          <button
            className="text-[#000000] font-inter text-[12px] font-semibold underline flex justify-end -mt-4"
            onClick={forgetPassword}
          >
            Forget Password?
          </button>
        )}
<<<<<<< Updated upstream
<<<<<<< Updated upstream

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
<<<<<<< Updated upstream
          type="submit"
          content={isLoading ? "Processing..." : buttonText}
          css={`rounded-[26px] py-3 w-full ${buttoncss}`}
          disabled={isLoading}
          style={{ backgroundColor: "#CC2B52", color: "white" }}
        />

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
=======
          content={buttonText}
          css="rounded-[26px] py-1 px-3 "
          type="submit"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
>>>>>>> Stashed changes
=======

        <Button
          content={buttonText}
          css="rounded-[26px] py-1 px-3 "
          type="submit"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
>>>>>>> Stashed changes
=======

        <Button
          content={buttonText}
          css="rounded-[26px] py-1 px-3 "
          type="submit"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
>>>>>>> Stashed changes
      </form>
    </div>
  );
};

export default FormSection;

