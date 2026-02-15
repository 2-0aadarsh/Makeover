/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ServiceModal from "../ServiceModal";
import { categoriesApi } from "../../../features/categories/categoriesApi";
import { transformServicesToGridCard, findCategoryByIdentifier } from "../../../utils/serviceTransformers";

// Hardcoded data - commented out; only dynamic services from DB are shown
// import VitaminCBrighteningFacial from "../../../assets/modals/cleanup and facical/regular/VitaminCBrighteningFacial.png";
// import FruitFacial from "../../../assets/modals/cleanup and facical/regular/FruitFacial.png";
// import Cleanup from "../../../assets/modals/cleanup and facical/regular/Cleanup.png";
// import AntiAgeing from "../../../assets/modals/cleanup and facical/regular/AntiAgeing.png";
// import DeTanFacial from "../../../assets/modals/cleanup and facical/regular/DeTanFacial.png";
// import RaagaRejuvenatingFacial from "../../../assets/modals/cleanup and facical/premium/RaagaRejuvenatingFacial.png";
// import StayYoungFacial from "../../../assets/modals/cleanup and facical/premium/StayYoungFacial.png";
// import O3ShineGlowFacial from "../../../assets/modals/cleanup and facical/premium/O3+ Shine & Glow Facial.png";
// import MamaEarthUbtanFacial from "../../../assets/modals/cleanup and facical/premium/MamaEarthUbtanFacial.png";
// import BridalFacial from "../../../assets/modals/cleanup and facical/bridal/O3+BridalFacial.png";
// import AromaMagicBridalFacial from "../../../assets/modals/cleanup and facical/bridal/AromaMagicBridalFacial.png";
// import KanpekiBridalFacial from "../../../assets/modals/cleanup and facical/bridal/Kanpeki Bridal Facial.png";
// const hardcodedCard = [
//   { title: "Regular", data: [ ... ] },
//   { title: "Premium", data: [ ... ] },
//   { title: "Bridal", data: [ ... ] },
// ];

const CleanupAndFacialModal = ({ onClose, services = [], currentServiceId = null, onServiceChange = null }) => {
  const [dynamicGridCard, setDynamicGridCard] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Only dynamic services from database (no hardcoded fallback)
  const displayGridCard = dynamicGridCard;

  return (
    <ServiceModal
      title="Cleanup & Facial"
      gridCard={displayGridCard}
      onClose={onClose}
      services={services}
      currentServiceId={currentServiceId}
      onServiceChange={onServiceChange}
      onConfirm={() => alert("Cleanup & Facial Booking Confirmed!")}
      loading={loading}
      loadingLayout="grid"
    />
  );
};

export default CleanupAndFacialModal;
