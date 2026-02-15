/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FormSection from "../common/forms/FormSection";
import { sendContactData } from "../../features/contact/contactThunks";
import { resetContactState } from "../../features/contact/ContactSlice";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";
import { IoClose } from "react-icons/io5";

const inputData = [
  { id: "name", labelName: "Name", type: "text", placeholder: "Enter your name" },
  { id: "email", labelName: "Email", type: "email", placeholder: "Enter your email" },
  { id: "phoneNumber", labelName: "Phone", type: "tel", placeholder: "Enter your phone number" },
  { id: "message", labelName: "Message", type: "textarea", placeholder: "Enter your message" },
];

const ContactUsModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.contact);

  useBodyScrollLock(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  useEffect(() => {
    return () => {
      dispatch(resetContactState());
    };
  }, [dispatch]);

  const handleInputChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    dispatch(sendContactData(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setFormData({ name: "", email: "", phoneNumber: "", message: "" });
        onClose();
      }
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 overflow-hidden overscroll-contain"
    >
      <div
        className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl max-w-[522px] w-[calc(100%-2rem)] max-h-[90vh] overflow-y-auto"
        data-modal-scroll
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[#CC2B52] text-lg font-semibold">Contact Us</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <IoClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <FormSection
          inputData={inputData}
          buttonText={loading ? "Sending..." : "Contact Us"}
          isLoading={loading}
          inputcss="px-3 sm:px-4 py-2 sm:py-3 rounded-[6px] transition-all focus:ring-2 focus:ring-[#CC2B52]/50 text-sm sm:text-base"
          labelcss="text-[#3B486E] text-sm sm:text-base lg:text-[16px]"
          buttoncss="mt-4 sm:mt-6 hover:bg-[#CC2B52]/90 transition-colors text-sm sm:text-base"
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={handleContactSubmit}
        />
      </div>
    </div>
  );
};

export default ContactUsModal;
