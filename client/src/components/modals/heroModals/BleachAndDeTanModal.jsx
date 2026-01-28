/* eslint-disable react/prop-types */
import ServiceModal from "../ServiceModal";

// classic images
import faceAndNeckBleach from "../../../assets/modals/bleach and de-tan/classic/faceAndNeckBleach.png";
import handsAndLegsBleach from "../../../assets/modals/bleach and de-tan/classic/handsAndLegsBleach.png";
import faceAndNeckDetan from "../../../assets/modals/bleach and de-tan/classic/faceAndNeckDetan.png";
import handsAndLegsDetan from "../../../assets/modals/bleach and de-tan/classic/handsAndLegsDetan.png";
import fullBodyDetan from "../../../assets/modals/bleach and de-tan/classic/fullBodyDetan.png";

// premium images
import fullBodyPolish from "../../../assets/modals/bleach and de-tan/premium/fullBodyPolish.svg";

const BleachAndDeTanModal = ({ onClose, services = [], currentServiceId = null, onServiceChange = null }) => {
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
          price: "599",
          taxIncluded: true,
          duration: "30mins",
          button: "Add +",
          service_id: "hand_leg_detan_classic",
        },
        {
          img: fullBodyDetan,
          cardHeader: "Full Body Detan ",
          description:
            "Removes tan, brightens skin, and restores your natural glow instantly.",
          price: "999",
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
          price: "249",
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
          price: "399",
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
          cardHeader: "Full Body Polish+Detan",
          description:
            "Exfoliates dead skin, smoothens texture, and restores an even, healthy glow from head to toe",
          price: "2199",
          taxIncluded: true,
          duration: "2hr 10mins",
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
      services={services}
      currentServiceId={currentServiceId}
      onServiceChange={onServiceChange}
      onConfirm={() => alert("Detan & Bleach Booking Confirmed!")}
      source="bleach-detan"
    />
  );
};

export default BleachAndDeTanModal;
