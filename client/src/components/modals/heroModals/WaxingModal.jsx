/* eslint-disable react/prop-types */
import ServiceModal from "../ServiceModal";

// classic images
import fullBodyClassic from "../../../assets/modals/waxing/classic/fullBody-classic.png";
import handsAndLegsClassic from "../../../assets/modals/waxing/classic/handsAndLegs-classic.png";
import underarmsClassic from "../../../assets/modals/waxing/classic/Underarm.png";
import faceWaxClassic from "../../../assets/modals/waxing/classic/Face Wax.png";
import threadingClassic from "../../../assets/modals/waxing/classic/Threading.png";

// premium images
import bikiniWaxingPremium from "../../../assets/modals/waxing/premium/bikiniWaxing-premium.png";
import fullBodyPremium from "../../../assets/modals/waxing/premium/fullBody-premium.png";
import handsAndLegsPremium from "../../../assets/modals/waxing/premium/handsAndLegs-premium.png";

const WaxingModal = ({ onClose, services = [], currentServiceId = null, onServiceChange = null }) => {
  const card = [
    {
      title: "Classic",
      data: [
        {
          img: fullBodyClassic,
          cardHeader: "Full Body Wax",
          description:
            "Reveal silky, radiant skin all over with our expert full body waxing",
          price: "899",
          taxIncluded: true,
          duration: "1hr 45mins",
          button: "Add +",
          service_id: "full_body_waxing_classic",
        },
        {
          img: handsAndLegsClassic,
          cardHeader: "Hand & Leg Wax",
          description:
            "Effortless elegance begins with clean, silky hands and legs, Underarms Included here",
          price: "499",
          taxIncluded: true,
          duration: "1hr 5mins",
          button: "Add +",
          service_id: "hands_and_legs_waxing_classic",
        },
        {
          img: underarmsClassic,
          cardHeader: "Underarms Wax",
          description:
            "Effortless elegance begins with clean, silky hands and legs, Underarms Included here",
          price: "149",
          taxIncluded: true,
          duration: "25mins",
          button: "Add +",
          service_id: "underarms_wax_classic",
        },
        {
          img: faceWaxClassic,
          cardHeader: "Face Wax",
          description:
            "Gently removes facial hair for smooth, clear, and even-toned skin with a fresh, polished look.",
          price: "249",
          taxIncluded: true,
          duration: "25 mins",
          button: "Add +",
          service_id: "face_wax_classic",
        },
        {
          img: threadingClassic,
          cardHeader: "Threading",
          description:
            "Effortless elegance begins with clean, silky hands and legs, Underarms Included here",
          price: "49",
          taxIncluded: true,
          duration: "5 mins",
          button: "Add +",
          service_id: "threading_classic",
        },
      ],
    },
    {
      title: "Premium",
      data: [
        {
          img: bikiniWaxingPremium,
          cardHeader: "Underarms Rica Wax",
          description:
            "Effortless elegance begins with clean, silky hands and legs, Underarms Included here",
          price: "249",
          taxIncluded: true,
          duration: "25mins",
          button: "Add +",
          service_id: "underarms_rica_wax_premium",
        },
        {
          img: fullBodyPremium,
          cardHeader: "Full Body O3+ Wax",
          description:
            "Reveal silky, radiant skin all over with our expert full body waxing",
          price: "1999",
          taxIncluded: true,
          duration: " 1hr 45mins",
          button: "Add +",
          service_id: "full_body_o3_plus_wax_premium",
        },
        {
          img: fullBodyPremium,
          cardHeader: "Full Body Rica Wax",
          description:
            "Reveal silky, radiant skin all over with our expert full body waxing",
          price: "1599",
          taxIncluded: true,
          duration: "1hr 45mins",
          button: "Add +",
          service_id: "full_body_rica_wax_premium",
        },
        {
          img: handsAndLegsPremium,
          cardHeader: "Hand & Leg Rica Wax",
          description:
            "Step into softness with our expertly done hand and leg premium waxing treatment.",
          price: "799",
          taxIncluded: true,
          duration: "45mins",
          button: "Add +",
          service_id: "hands_and_legs_waxing_premium",
        },
      ],
    },
  ];

  const waxingInfo = {
    items: [
      "AC is highly recommended for waxing.",
      "Areas with wound or cuts won't be waxed.",
      "Do share or be aware of any history of reaction due to wax",
      "Wax box will not be handed over to customer",
      "The hair should be minimum 0.25in to be able to wax properly",
    ],
  };

  return (
    <ServiceModal
      title="Waxing"
      gridCard={card}
      infoContent={waxingInfo}
      onClose={onClose}
      services={services}
      currentServiceId={currentServiceId}
      onServiceChange={onServiceChange}
      onConfirm={() => alert("Waxing Booking Confirmed!")}
    />
  );
};

export default WaxingModal;
