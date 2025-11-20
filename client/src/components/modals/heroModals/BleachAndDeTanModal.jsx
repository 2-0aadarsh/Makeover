/* eslint-disable react/prop-types */
import ServiceModal from "../ServiceModal";

// classic images
import faceAndNeckBleach from "../../../assets/modals/bleach and de-tan/classic/faceAndNeckBleach.png";
import handsAndLegsBleach from "../../../assets/modals/bleach and de-tan/classic/handsAndLegsBleach.png";
import faceAndNeckDetan from "../../../assets/modals/bleach and de-tan/classic/faceAndNeckDetan.png";
import handsAndLegsDetan from "../../../assets/modals/bleach and de-tan/classic/handsAndLegsDetan.png";
import fullBodyDetan from "../../../assets/modals/bleach and de-tan/classic/fullBodyDetan.png";

// premium images
import fullBodyPolish from "../../../assets/modals/bleach and de-tan/premium/fullBodyPolish.png";

const BleachAndDeTanModal = ({ onClose }) => {
  const card = [
    {
      title: "Classic",
      data: [
        {
          img: faceAndNeckDetan,
          cardHeader: "Face & Neck Detan",
          description:
            "Step into softness with our expertly done hand and leg premium de-tan treatment.",
          price: "399",
          taxIncluded: true,
          duration: "30mins",
          button: "Add +",
          service_id: "face_neck_detan_classic",
        },
        {
          img: handsAndLegsDetan,
          cardHeader: "Hand & Leg Detan",
          description:
            "Effortless elegance begins with clean, silky hands and legs",
          price: "399",
          taxIncluded: true,
          duration: "30mins",
          button: "Add +",
          service_id: "hand_leg_detan_classic",
        },
        {
          img: fullBodyDetan,
          cardHeader: "Full Body Detan ",
          description:
            "Reveal silky, radiant skin all over with our expert full body de-tan",
          price: "899",
          taxIncluded: true,
          duration: "1hr 30mins",
          button: "Add +",
          service_id: "full_body_detan_classic",
        },
        {
          img: faceAndNeckBleach,
          cardHeader: "Face & Neck Bleach",
          description:
            "Step into softness with our expertly done face and neck premium de-tan treatment.",
          price: "255",
          taxIncluded: true,
          duration: "30mins",
          button: "Add +",
          service_id: "face_neck_bleach_classic",
        },
        {
          img: handsAndLegsBleach,
          cardHeader: "Hand & Leg Bleach",
          description:
            "Effortless elegance begins with clean, silky hands and legs",
          price: "255",
          taxIncluded: true,
          duration: "30mins",
          button: "Add +",
          service_id: "hand_leg_bleach_classic",
        },
      ],
    },
    {
      title: "Premium",
      data: [
        {
          img: fullBodyPolish,
          cardHeader: "Full Body Polish and Waxing",
          description:
            "Experience the ultimate in comfort and elegance with full body premium de-tan",
          price: "1499",
          taxIncluded: true,
          duration: "1hr 25mins",
          button: "Add +",
          service_id: "full_body_polish_and_waxing_premium",
        },
      ],
    },
  ];

  return (
    <ServiceModal
      title="Detan & Bleach"
      gridCard={card}
      onClose={onClose}
      onConfirm={() => alert("Detan & Bleach Booking Confirmed!")}
      source="bleach-detan"
    />
  );
};

export default BleachAndDeTanModal;
