/* eslint-disable react/prop-types */
import ServiceModal from "../ServiceModal";

// classic images
import fullBodyClassic from "../../../assets/modals/waxing/classic/fullBody-classic.png";
import handsAndLegsClassic from "../../../assets/modals/waxing/classic/handsAndLegs-classic.png";

// premium images
import bikiniWaxingPremium from "../../../assets/modals/waxing/premium/bikiniWaxing-premium.png";
import fullBodyPremium from "../../../assets/modals/waxing/premium/fullBody-premium.png";
import handsAndLegsPremium from "../../../assets/modals/waxing/premium/handsAndLegs-premium.png";

const WaxingModal = ({ onClose }) => {
  const card = [
    {
      title: "Classic",
      data: [
        {
          img: fullBodyClassic,
          cardHeader: "Full Body",
          description:
            "Reveal silky, radiant skin all over with our expert full body waxing",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
        },
        {
          img: handsAndLegsClassic,
          cardHeader: "Hands And Legs",
          description:
            "Effortless elegance begins with clean, silky hands and legs, Underarms Included here",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
        },
      ],
    },
    {
      title: "Premium",
      data: [
        {
          img: bikiniWaxingPremium,
          cardHeader: "Bikini Waxing",
          description:
            "Feel fresh, clean, and confident with our expertly delivered premium bikini wax",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
        },
        {
          img: fullBodyPremium,
          cardHeader: "Full Body",
          description:
            "Experience the ultimate in comfort and elegance with full body premium waxing",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
        },
        {
          img: handsAndLegsPremium,
          cardHeader: "Hands And Legs",
          description:
            "Step into softness with our expertly done hand and leg premium waxing treatment.",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
        },
      ],
    },
  ];

  return (
    <ServiceModal
      title="Waxing Services"
      gridCard={card}
      onClose={onClose}
      onConfirm={() => alert("Waxing Booking Confirmed!")}
    />
  );
};

export default WaxingModal;
