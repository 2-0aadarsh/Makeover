/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ServiceModal from "../ServiceModal";
import { categoriesApi } from "../../../features/categories/categoriesApi";
import { transformServicesToGridCard, findCategoryByIdentifier } from "../../../utils/serviceTransformers";

// Hardcoded data - kept for fallback
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

const CleanupAndFacialModal = ({ onClose, services = [], currentServiceId = null, onServiceChange = null }) => {
  const [dynamicGridCard, setDynamicGridCard] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcoded data - kept intact for fallback
  const hardcodedCard = [
    {
      title: "Regular",
      data: [
        {
          img: VitaminCBrighteningFacial,
          cardHeader: "Vit C Brightening Facial",
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
        {
          img: MamaEarthUbtanFacial,
          cardHeader: "Mamma Earth Ubtan Facial",
          description:
            "Brighten and revive your skin with the natural goodness of ubtan and turmeric",
          price: "699",
          taxIncluded: true,
          duration: "1hr 10mins",
          button: "Add +",
          service_id: "mamma_earth_ubtan_facial_regular",
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
          img: AntiAgeing,
          cardHeader: "Raaga Anti-Ageing Facial",
          description:
            "Combat early signs of ageing with a deeply nourishing facial experience",
          price: "1199",
          taxIncluded: true,
          duration: "1hr 10mins",
          button: "Add +",
          service_id: "anti_ageing_30_plus_premium",
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

  // Fetch dynamic data
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setLoading(true);
        
        // First, get all categories to find "Cleanup & Facial" or similar
        const categoriesResponse = await categoriesApi.getAllCategories();
        const categories = categoriesResponse.data || [];
        
        // Try to find category by common names/slugs
        const category = findCategoryByIdentifier(categories, "cleanup-facial") || 
                        findCategoryByIdentifier(categories, "cleanup-and-facial") ||
                        findCategoryByIdentifier(categories, "Cleanup & Facial") ||
                        findCategoryByIdentifier(categories, "Cleanup and Facial");
        
        if (category && category._id) {
          // Fetch services for this category
          const servicesResponse = await categoriesApi.getCategoryServices(category._id);
          const categoryServices = servicesResponse.data?.services || [];
          
          if (categoryServices.length > 0) {
            // Transform services to gridCard format
            const transformedGridCard = transformServicesToGridCard(categoryServices);
            setDynamicGridCard(transformedGridCard);
            console.log("✅ Dynamic data loaded for Cleanup & Facial:", transformedGridCard);
          } else {
            console.log("⚠️ No services found for Cleanup & Facial category");
            setDynamicGridCard([]);
          }
        } else {
          console.log("⚠️ Cleanup & Facial category not found in database");
          setDynamicGridCard([]);
        }
      } catch (error) {
        console.error("❌ Error fetching dynamic data for Cleanup & Facial:", error);
        setDynamicGridCard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicData();
  }, []);

  // Use dynamic data if available, otherwise fallback to hardcoded
  const displayGridCard = dynamicGridCard.length > 0 ? dynamicGridCard : hardcodedCard;

  return (
    <ServiceModal
      title="Cleanup & Facial"
      gridCard={displayGridCard}
      onClose={onClose}
      services={services}
      currentServiceId={currentServiceId}
      onServiceChange={onServiceChange}
      onConfirm={() => alert("Cleanup & Facial Booking Confirmed!")}
    />
  );
};

export default CleanupAndFacialModal;
