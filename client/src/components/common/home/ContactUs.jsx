import FormSection from "../forms/FormSection";

const ContactUs = () => {
  const inputData = [
    {
      id: "name",
      labelName: "Name",
      type: "text",
      placeholder: "Enter your name",
    },
    {
      id: "email",
      labelName: "Email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      id: "phoneNumber",
      labelName: "Phone",
      type: "tel",
      placeholder: "Enter your phone number",
    },
    {
      id: "message",
      labelName: "Message",
      type: "textarea",
      placeholder: "Enter your message",
    },
  ];
  return (
    <div className="contact-us flex justify-between items-start w-full h-[706px] py-[60px] px-20 ">
      <div className="message font-normal text-[54px] leading-[72px] text-[#212121] w-[728px]">
        <h3 className="text-[#CC2B52] text-xl">Connect</h3>

        <h4>
          Your <span className="text-[#CC2B52]">Bridal</span>
        </h4>

        <h4>makeover is just a message away</h4>
      </div>

      <div className="form-container w-[522px] p-8 shadow-xl rounded-lg bg-white">
        <FormSection
          inputData={inputData}
          buttonText="Contact Us"
          inputcss="px-4 py-3 rounded-[6px]"
          labelcss="text-[#3B486E] text-[16px]"
        />
      </div>
    </div>
  );
}

export default ContactUs