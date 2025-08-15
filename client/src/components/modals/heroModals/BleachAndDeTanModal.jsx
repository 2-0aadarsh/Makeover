import ServiceModal from "../ServiceModal";

// classic images
import faceAndNeckBleach   from "../../../assets/modals/bleach and de-tan/classic/faceAndNeckBleach.png";
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
          cardHeader: "Face & Neck De-Tan",
          description:
            "Step into softness with our expertly done hand and leg premium de-tan treatment.",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
        },
        {
          img: handsAndLegsDetan,
          cardHeader: "Hand & Leg De-tan",
          description:
            "Effortless elegance begins with clean, silky hands and legs",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
        },
        {
          img: fullBodyDetan,
          cardHeader: "Full Body De-Tan ",
          description:
            "Reveal silky, radiant skin all over with our expert full body de-tan",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
        },
        {
          img: faceAndNeckBleach,
          cardHeader: "Face & Neck Bleach",
          description:
            "Step into softness with our expertly done face and neck premium de-tan treatment.",
          price: "1600",
          taxIncluded: true,
          duration: null,
          button: "Add +",
        },
        {
          img: handsAndLegsBleach,
          cardHeader: "Hand & Leg Bleach",
          description:
            "Effortless elegance begins with clean, silky hands and legs",
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
          img: fullBodyPolish,
          cardHeader: "Full Body Polish",
          description:
            "Experience the ultimate in comfort and elegance with full body premium de-tan",
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
      title="Bleach & De-Tan"
      gridCard={card}
      onClose={onClose}
      onConfirm={() => alert("Bleach & De-Tan Booking Confirmed!")}
    />
  );
};

export default BleachAndDeTanModal;
