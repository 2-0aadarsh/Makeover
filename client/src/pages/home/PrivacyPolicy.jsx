import { useNavigate } from "react-router-dom";
import SectionTitle from "../../components/ui/SectionTitle";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const privacyData = [
    {
      id: 1,
      title: "Information We Collect",
      content: [
        "We collect the following types of information:",
        "a. Personal Information",
        "When you register or book a service, we may collect:",
        "Full name",
        "Mobile number",
        "Email address",
        "Address for service delivery",
        "Gender and age (optional)",
        "Payment details (handled securely by third-party payment gateways)",
        "b. Usage & Device Data",
        "When you access our website or app, we may collect:",
        "IP address",
        "Device type and OS",
        "Browser information",
        "Location data (with permission)",
        "Service usage and interaction logs",
        "c. Third-Party Data",
        "We may receive information from third-party platforms (such as payment providers or social media if you connect accounts).",
      ],
    },
    {
      id: 2,
      title: "How We Use Your Information",
      content: [
        "Deliver and manage your at-home beauty services",
        "Personalize your experience",
        "Send appointment confirmations, reminders, and service updates",
        "Process payments and generate invoices",
        "Respond to your queries and provide customer support",
        "Send promotional messages or offers (only with your consent)",
        "Improve our services and platform performance",
        "Comply with legal obligations",
      ],
    },
    {
      id: 3,
      title: "Sharing of Information",
      content: [
        "We do not sell or rent your personal data. However, we may share your information with:",
        "Beauty professionals assigned to your service, for coordination and delivery",
        "Payment gateway partners for transaction processing",
        "Logistics or support partners for handling bookings and deliveries",
        "Legal authorities if required by law or to protect our rights",
        "Marketing and analytics vendors (only with non-personally identifiable data)",
      ],
    },
    {
      id: 4,
      title: "Data Security",
      content: [
        "We implement robust security measures to protect your data:",
        "Encrypted transmission (HTTPS, SSL)",
        "Secure storage with limited access",
        "Regular audits and data protection reviews",
        "Despite our efforts, no method of data transmission over the internet is 100% secure. You use our services at your own risk.",
      ],
    },
    {
      id: 5,
      title: "Your Choices and Rights",
      content: [
        "You have the right to:",
        "Access or update your personal information",
        "Request deletion of your account and data",
        "Opt-out of marketing communications at any time",
        "Control app permissions like location or notifications",
        "To make any of these requests, contact us at [Email Address].",
      ],
    },
    {
      id: 6,
      title: "Cookies and Tracking",
      content: [
        "We use cookies and similar technologies to enhance your browsing experience and analyze traffic.",
        "You can disable cookies via your browser settings, but some site features may not work correctly.",
      ],
    },
    {
      id: 7,
      title: "Data Retention",
      content: [
        "We retain your information only as long as necessary to provide our services or as required by law.",
        "Once no longer needed, your data is securely deleted.",
      ],
    },
    {
      id: 8,
      title: "Children's Privacy",
      content: [
        "Our services are intended for users 18 years and older.",
        "We do not knowingly collect personal data from children under 18.",
        "If found, such data will be deleted promptly.",
      ],
    },
    {
      id: 9,
      title: "Changes to This Policy",
      content: [
        "We may update this Privacy Policy from time to time.",
        "We will notify you of significant changes through the app, website, or email.",
        "Please review this page periodically for the latest information.",
      ],
    },
  ];

  return (
    <div className="px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-32">
      <div className="font-inter text-[#6E6E6E] leading-relaxed flex flex-col gap-6 md:gap-8 lg:gap-10">
        {/* Back Button */}
        {/* <div className="mb-2 md:mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#CC2B52] hover:text-[#B02547] transition-colors duration-200 font-medium text-sm md:text-base"
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
        </div> */}

        <SectionTitle title="Privacy Policy" />

        <div className="text-base md:text-lg lg:text-[20px] leading-relaxed md:leading-[180%] lg:leading-[200%] font-normal">
          <p className="mb-4 md:mb-5 text-sm md:text-base lg:text-lg">
            At Wemakeover, your privacy is our top priority. This Privacy Policy
            explains how we collect, use, protect, and share your personal
            information when you interact with our website, mobile application,
            or services.
            <br className="hidden sm:block" />
            By using our services, you consent to the practices described in
            this policy.
          </p>

          {privacyData.map((section) => (
            <div key={section.id} className="mb-4 md:mb-6">
              <h2 className="mb-2 md:mb-3 text-lg md:text-xl font-semibold text-gray-800">
                {section.id}. {section.title}
              </h2>
              <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 text-sm md:text-base lg:text-inherit">
                {section.content.map((point, idx) => (
                  <li key={idx} className="leading-normal md:leading-relaxed">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
