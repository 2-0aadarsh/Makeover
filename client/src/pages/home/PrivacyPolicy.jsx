import SectionTitle from "../../components/ui/SectionTitle";

const PrivacyPolicy = () => {

  const termsData = [
  {
    id: 1,
    title: "Service Eligibility",
    content: [
      "You must be at least 18 years old to book a service.",
      "Services must be booked by individuals who can enter into legally binding contracts under applicable law.",
      "Accurate information must be provided while booking. False or incomplete information may result in cancellation.",
    ],
  },
  {
    id: 2,
    title: "Appointments & Booking",
    content: [
      "Bookings can be made via our website, mobile app, or customer service.",
      "Appointment availability is subject to service professional availability in your area.",
      "We reserve the right to refuse or reschedule a booking in case of any operational or safety concerns.",
    ],
  },
  {
    id: 3,
    title: "Pricing & Payment",
    content: [
      "All prices are listed in INR and inclusive of applicable taxes unless otherwise specified.",
      "Prices may vary based on location, service provider, or seasonal promotions.",
      "Full payment is required at the time of booking or upon service completion via our accepted payment methods (UPI, cards, wallets, etc.).",
      "We do not accept cash payments unless pre-approved.",
    ],
  },
  {
    id: 4,
    title: "Cancellations & Refunds",
    content: [
      "Appointments canceled less than 2 hours before the scheduled time may incur a cancellation fee of 50%.",
      "In case of no-shows, the full service amount will be charged.",
      "Refunds, if applicable, will be processed within 7 working days to the original payment method.",
      "Makeover reserves the right to cancel services due to unforeseen circumstances (weather, safety, etc.)",
    ],
  },
  {
    id: 5,
    title: "Hygiene & Safety",
    content: [
      "Our professionals follow strict hygiene protocols including sanitization and use of disposable tools.",
      "Clients are expected to ensure a clean and safe environment at home.",
      "Services will be discontinued without refund if the professional feels unsafe or is harassed in any form.",
    ],
  },
  {
    id: 6,
    title: "Liability & Disclaimer",
    content: [
      "While our professionals are trained and experienced, Makeover is not liable for any adverse skin or hair reactions caused by product allergies or pre-existing conditions.",
      "Clients must disclose any allergies or medical conditions prior to service.",
      "We are not responsible for personal belongings during the service.",
    ],
  },
  {
    id: 7,
    title: "Intellectual Property",
    content: [
      "All content on our website, app, and branding (text, images, logos, videos) is the intellectual property of Makeover and may not be used without permission.",
    ],
  },
  {
    id: 8,
    title: "User Conduct",
    content: [
      "You agree not to misuse our platform or services, including but not limited to:",
      "Abusive language",
      "Fraudulent bookings",
      "Inappropriate behavior with professionals",
      "Violation may lead to a permanent ban from our services.",
    ],
  },
  {
    id: 9,
    title: "Reviews & Feedback",
    content: [
      "By submitting reviews, you grant Makeover the right to use, modify, and publish the content across our platforms.",
      "Offensive or misleading reviews may be removed.",
    ],
  },
  {
    id: 10,
    title: "Privacy Policy",
    content: [
      "We value your privacy. Your personal information is stored securely and used solely for service delivery and communication.",
      "For more details, refer to our Privacy Policy.",
    ],
  },
  {
    id: 11,
    title: "Modifications to Terms",
    content: [
      "Makeover reserves the right to update or modify these Terms & Conditions at any time without prior notice.",
      "Continued use of our services after changes constitutes acceptance of the revised terms.",
    ],
  },
  {
    id: 12,
    title: "Governing Law",
    content: [
      "These terms are governed by the laws of India.",
      "Any disputes shall be subject to the exclusive jurisdiction of the courts located in [Your City/State].",
    ],
  },
  ];



  return (
    <div className="p-20">
      <div className=" font-inter text-[#6E6E6E] leading-relaxed flex flex-col gap-10">
        <SectionTitle title="Terms & Conditions" />

        <div className="text-[20px] leading-[200%] font-normal">
          <p className="mb-5">
            Welcome to Makeover! <br />
            These Terms & Conditions govern your use of our services, including
            website, mobile app, and at-home beauty services. By booking or
            using our services, you agree to the terms outlined below.
          </p>

          {termsData.map((section) => (
            <div key={section.id} className="mb-6">
              <h2 className="mb-2">
                {section.id}. {section.title}
              </h2>
              <ul className="list-disc pl-6 space-y-1">
                {section.content.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy