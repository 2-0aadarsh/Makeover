import ServiceModal from "../ServiceModal";
import BridalMakeup from "../../../assets/modals/professional makeup/BridalMakeup.png";
import EngagementMakeup from "../../../assets/modals/professional makeup/EngagementMakeup2.png";
import PartyMakeup from "../../../assets/modals/professional makeup/PartyMakeup.png";

const ProfessionalMakeup = ({ onClose }) => {
  const makeupCard = [
    {
      img: BridalMakeup,
      cardHeader: "Bridal Makeup",
      serviceCategory: "Professional Makeup",
      description:
        "We create the most elegant bridal looks! Contact us to book yours today.",
      PriceEstimate: "12k-28k",
      button: "Enquire Now",
    },
    {
      img: PartyMakeup,
      cardHeader: "Party Makeup",
      serviceCategory: "Professional Makeup",
      description:
        "A flawless look crafted to enhance your features and keep you glowing",
      PriceEstimate: "2.5k-4k",
      button: "Enquire Now",
    },
    {
      img: EngagementMakeup,
      cardHeader: "Engagement/Reception",
      serviceCategory: "Professional Makeup",
      description:
        "Seamless looks by our professionals! Contact us to book yours today.",
      PriceEstimate: "10k-16k",
      button: "Enquire Now",
    },
  ];
  return (
    <ServiceModal
      title="Professional Makeup"
      description="Get camera-ready with flawless makeup done by our expert artists."
      cards={makeupCard}
      onClose={onClose}
      onConfirm={() => alert("Professional Makeup Booking Confirmed!")}
      source="professional-makeup"
    />
  );
};

export default ProfessionalMakeup;
