/* eslint-disable react/prop-types */
import ServiceModal from "../ServiceModal";

// classic images
import ManicureClassic from "../../../assets/modals//manicure and pedicure/classic/Manicure-classic.png";
import PedicureClassic from "../../../assets/modals//manicure and pedicure/classic/Pedicure-classic.png";

// premium images
import ManicurePremium from "../../../assets/modals/manicure and pedicure/premium/Manicure-premium.png";
import PedicurePremium from "../../../assets/modals/manicure and pedicure/premium/Pedicure-premium.png";

const ManicureAndPedicureModal = ({ onClose }) => {
  const card = [
    {
      title: "Classic",
      data: [
        {
          img: ManicureClassic,
          cardHeader: "Manicure",
          description:
            "Restore natural beauty with our clean, neat, and nourishing classic manicure",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
          service_id: "manicure_classic",
        },
        {
          img: PedicureClassic,
          cardHeader: "Pedicure",
          description:
            "Rejuvenate your feet with our expertly delivered classic pedicure treatment",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
          service_id: "pedicure_classic",
        },
      ],
    },
    {
      title: "Premium",
      data: [
        {
          img: ManicurePremium,
          cardHeader: "Manicure",
          description:
            "A deluxe hand care ritual that exfoliates, hydrates, and leaves a lasting glow",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
          service_id: "manicure_premium",
        },
        {
          img: PedicurePremium,
          cardHeader: "Pedicure",
          description:
            "A deluxe pedicure experience that smooths & nourishes every step",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
          service_id: "pedicure_premium",
        },
      ],
    },
  ];

  return (
    <ServiceModal
      title="Manicure & Pedicure"
      gridCard={card}
      onClose={onClose}
      onConfirm={() => alert("Manicure & Pedicure Booking Confirmed!")}
    />
  );
};

export default ManicureAndPedicureModal;
