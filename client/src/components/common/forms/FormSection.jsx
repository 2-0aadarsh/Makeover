/* eslint-disable react/prop-types */
import { useState } from "react";
import useSignup from "../../../hooks/useSignup";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { useNavigate } from "react-router-dom";

const FormSection = ({ title, description, inputData }) => {
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
    <div className="flex flex-col gap-3">
      <h2 className="title font-semibold text-[22px]">{title}</h2>
      <p className="text-[12px] text-[#313957]">{description}</p>

      <form
        className="input-containers flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        {inputData.map((input, index) => (
          <Input
            key={index}
            labelName={input.labelName}
            type={input.type}
            id={input.id}
            placeholder={input.placeholder}
            value={formData[input.id]} // Controlled input
            onChange={handleChange}
          />
        ))}

        <Button
          content="Sign Up"
          css="rounded-[26px] py-1 px-3 hover:bg-[#CC2B52]/90 transition-all duration-300"
          type="submit"
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default FormSection;

