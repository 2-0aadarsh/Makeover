/* eslint-disable react/prop-types */
import ServiceModal from "../ServiceModal";

// classic images
import ManicureClassic from "../../../assets/modals//manicure and pedicure/classic/Manicure-classic.png";
import PedicureClassic from "../../../assets/modals//manicure and pedicure/classic/Pedicure-classic.png";
import FootMassageClassic from "../../../assets/modals//manicure and pedicure/classic/Foot Massage.png";
import HeadNeckMassageClassic from "../../../assets/modals//manicure and pedicure/classic/Head & Neck  Massage.png";
import FullBodyMassageClassic from "../../../assets/modals//manicure and pedicure/classic/Full Body  Massage.png";

// premium images
import ManicurePremium from "../../../assets/modals/manicure and pedicure/premium/Manicure-premium.png";
import PedicurePremium from "../../../assets/modals/manicure and pedicure/premium/Pedicure-premium.png";
import PremiumMassage from "../../../assets/modals/manicure and pedicure/premium/Premium Massage.png";

const ManicureAndPedicureModal = ({ onClose, services = [], currentServiceId = null, onServiceChange = null }) => {
  const card = [
    {
      title: "Classic",
      data: [
        {
          img: ManicureClassic,
          cardHeader: "Manicure",
          description:
            "Restore natural beauty with our clean, neat, and nourishing classic manicure",
          price: "399",
          taxIncluded: true,
          duration: "40mins",
          button: "Add +",
          service_id: "manicure_classic",
        },
        {
          img: PedicureClassic,
          cardHeader: "Pedicure",
          description:
            "Rejuvenate your feet with our expertly delivered classic pedicure treatment",
          price: "499",
          taxIncluded: true,
          duration: "55mins",
          button: "Add +",
          service_id: "pedicure_classic",
        },
        {
          img: HeadNeckMassageClassic,
          cardHeader: "Head & Neck Massage",
          description:
            "Soothe tension and fatigue with a calming massage that refreshes your mind and senses.",
          price: "299",
          taxIncluded: true,
          duration: "25mins",
          button: "Add +",
          service_id: "head_neck_massage_classic",
        },
        {
          img: FootMassageClassic,
          cardHeader: "Relaxing Foot Massage",
          description:
            "Get relaxed with the best foot massage, relieving full-day stress",
          price: "199",
          taxIncluded: true,
          duration: "20mins",
          button: "Add +",
          service_id: "relaxing_foot_massage_classic",
        },
        {
          img: FullBodyMassageClassic,
          cardHeader: "Full Body Massage",
          description:
            "Relaxes muscles, reduces fatigue, and delivers total rejuvenation for your mind and body.",
          price: "999",
          taxIncluded: true,
          duration: "1hr 10mins",
          button: "Add +",
          service_id: "full_body_massage_classic",
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
          price: "599",
          taxIncluded: true,
          duration: "55mins",
          button: "Add +",
          service_id: "manicure_premium",
        },
        {
          img: PedicurePremium,
          cardHeader: "Pedicure",
          description:
            "A deluxe pedicure experience that smooths & nourishes every step",
          price: "699",
          taxIncluded: true,
          duration: "1hr 10mins",
          button: "Add +",
          service_id: "pedicure_premium",
        },
        {
          img: PremiumMassage,
          cardHeader: "Full Body Premium Massage",
          description:
            "Relaxes muscles, reduces fatigue, and delivers total rejuvenation for your mind and body.",
          price: "1499",
          taxIncluded: true,
          duration: "1hr 45mins",
          button: "Add +",
          service_id: "full_body_premium_massage",
        },
      ],
    },
  ];

  return (
    <ServiceModal
      title="Mani/Pedi & Massage"
      gridCard={card}
      onClose={onClose}
      services={services}
      currentServiceId={currentServiceId}
      onServiceChange={onServiceChange}
      onConfirm={() => alert("Mani/Pedi & Massage Booking Confirmed!")}
    />
  );
};

export default ManicureAndPedicureModal;
