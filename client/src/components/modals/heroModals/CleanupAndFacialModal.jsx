/* eslint-disable react/prop-types */
import ServiceModal from "../ServiceModal";
import VitaminCBrighteningFacial from "../../../assets/modals/cleanup and facical/regular/VitaminCBrighteningFacial.png";

// regular images
import FruitFacial from "../../../assets/modals/cleanup and facical/regular/FruitFacial.png";
import Cleanup from "../../../assets/modals/cleanup and facical/regular/Cleanup.png";
import AntiAgeing from "../../../assets/modals/cleanup and facical/regular/AntiAgeing.png";
import DeTanFacial from "../../../assets/modals/cleanup and facical/regular/DeTanFacial.png";

// premium images
import RaagaRejuvenatingFacial from "../../../assets/modals/cleanup and facical/premium/RaagaRejuvenatingFacial.png";
import StayYoungFacial from "../../../assets/modals/cleanup and facical/premium/StayYoungFacial.png";
import O3ShineGlowFacial from "../../../assets/modals/cleanup and facical/premium/O3+ Shine & Glow Facial.png";
import MamaEarthUbtanFacial from "../../../assets/modals/cleanup and facical/premium/MamaEarthUbtanFacial.png";

// bridal images
import BridalFacial from "../../../assets/modals/cleanup and facical/bridal/O3+BridalFacial.png";
import AromaMagicBridalFacial from "../../../assets/modals/cleanup and facical/bridal/AromaMagicBridalFacial.png";
import KanpekiBridalFacial from "../../../assets/modals/cleanup and facical/bridal/Kanpeki Bridal Facial.png";

const CleanupAndFacialModal = ({ onClose }) => {
  const card = [
    {
      title: "Regular",
      data: [
        {
          img: VitaminCBrighteningFacial,
          cardHeader: "Vitamin C Brightening Facial",
          description:
            "Restores luminosity and evens skin tone with the power of Vitamin C",
          price: "799",
          taxIncluded: true,
          duration: "1hr 10mins",
          button: "Add +",
          service_id: "vitamin_c_brightening_facial_regular",
        },
        {
          img: FruitFacial,
          cardHeader: "Fruit Facial",
          description:
            "Indulge in a fruity rejuvenation for instantly fresh skin",
          price: "649",
          taxIncluded: true,
          duration: "45mins",
          button: "Add +",
          service_id: "fruit_facial_regular",
        },
        {
          img: Cleanup,
          cardHeader: "Face & Neck Cleanup",
          description:
            "Indulge in a fruity rejuvenation for instantly fresh skin",
          price: "599",
          taxIncluded: true,
          duration: "45mins",
          button: "Add +",
          service_id: "cleanup_regular",
        },
        {
          img: AntiAgeing,
          cardHeader: "Anti-Ageing For 30+",
          description:
            "Combat early signs of ageing with a deeply nourishing facial experience",
          price: "849",
          taxIncluded: true,
          duration: "1hr 10mins",
          button: "Add +",
          service_id: "anti_ageing_30_plus_regular",
        },
        {
          img: DeTanFacial,
          cardHeader: "De-Tan Facial",
          description:
            "Combat early signs of ageing with a deeply nourishing facial experience",
          price: "799",
          taxIncluded: true,
          duration: "1hr 10mins",
          button: "Add +",
          service_id: "detan_facial_regular",
        },
      ],
    },
    {
      title: "Premium",
      data: [
        {
          img: RaagaRejuvenatingFacial,
          cardHeader: "Raaga Rejuvenating Facial",
          description:
            "Experience a serene skincare journey with Raaga's signature rejuvenating facial",
          price: "1199",
          taxIncluded: true,
          duration: "1hr 10mins",
          button: "Add +",
          service_id: "o3_plus_cleanup_premium",
        },
        {
          img: O3ShineGlowFacial,
          cardHeader: "O3+ Shine & Glow Facial",
          description:
            "Restores luminosity and evens skin tone with the power of Vitamin C",
          price: "1499",
          taxIncluded: true,
          duration: "1hr 10mins",
          button: "Add +",
          service_id: "o3_stay_young_facial_premium",
        },
        {
          img: MamaEarthUbtanFacial,
          cardHeader: "Mamma Earth Ubtan Facial",
          description:
            "Brighten and revive your skin with the natural goodness of ubtan and turmeric",
          price: "649",
          taxIncluded: true,
          duration: "1hr 10mins",
          button: "Add +",
          service_id: "mamma_earth_ubtan_facial_premium",
        },
      ],
    },
    {
      title: "Bridal",
      data: [
        {
          img: BridalFacial,
          cardHeader: "O3+ Bridal Facial",
          description:
            "Get wedding-ready with the O3+ Bridal Facial-crafted for an instant bridal glow",
          price: "1999",
          taxIncluded: true,
          duration: "1hr 45mins",
          button: "Add +",
          service_id: "o3_bridal_facial_bridal",
        },
        {
          img: KanpekiBridalFacial,
          cardHeader: "Kanpeki Bridal Facial",
          description:
            "Get the best glow & sparkling experience by Kanpeki's bridal facial kit",
          price: "1999",
          taxIncluded: true,
          duration: "1hr 45mins",
          button: "Add +",
          service_id: "aroma_magic_bridal_facial_bridal",
        },
      ],
    },
  ];

  return (
    <ServiceModal
      title="Cleanup & Facial"
      gridCard={card}
      onClose={onClose}
      onConfirm={() => alert("Cleanup & Facial Booking Confirmed!")}
    />
  );
};

export default CleanupAndFacialModal;
