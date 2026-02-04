/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ServiceModal from "../ServiceModal";
import { categoriesApi } from "../../../features/categories/categoriesApi";
import { transformServicesToFlexCards, findCategoryByIdentifier } from "../../../utils/serviceTransformers";

// Hardcoded data - commented out; only dynamic services from DB are shown
// import BridalMehendi from "../../../assets/modals/Professional Mehendi/BridalMehendi.png";
// import MehendiForAll from "../../../assets/modals/Professional Mehendi/MehendiForAll.png";
// import CustomDesigns from "../../../assets/modals/Professional Mehendi/CustomDesigns.png";
// const hardcodedMehendiCard = [
//   { img: BridalMehendi, cardHeader: "Bridal Mehendi", serviceCategory: "Professional Mehendi", description: "Let your hands tell a love story with our bespoke Bridal Mehendi designs", Price: null, PriceEstimate: "2.5k-11k", includingTax: true, service: "Both Hands & Legs", button: "Add +", service_id: "bridal_mehendi" },
//   { img: MehendiForAll, cardHeader: "Mehendi For All", serviceCategory: "Professional Mehendi", description: "From casual charm to festive flair—mehendi that suits every style", Price: 499, PriceEstimate: null, includingTax: true, service: "Both Hands", button: "Enquiry Now", service_id: "mehendi_for_all" },
//   { img: CustomDesigns, cardHeader: "Custom Designs", serviceCategory: "Professional Mehendi", description: "From names to motifs—custom mehendi that's as unique as you are ", pricingNote: "Get in touch for pricing", button: "Add +", service_id: "custom_designs_mehendi" },
// ];

const ProfessionalMehendiModal = ({ onClose, services = [], currentServiceId = null, onServiceChange = null }) => {
  const [dynamicCards, setDynamicCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await categoriesApi.getAllCategories();
        const categories = categoriesResponse.data || [];
        const category = findCategoryByIdentifier(categories, "professional-mehendi") ||
          findCategoryByIdentifier(categories, "Professional Mehendi");
        if (category && category._id) {
          const servicesResponse = await categoriesApi.getCategoryServices(category._id);
          const categoryServices = servicesResponse.data?.services || [];
          if (categoryServices.length > 0) {
            const transformedCards = transformServicesToFlexCards(categoryServices, category.name);
            setDynamicCards(transformedCards);
          } else {
            setDynamicCards([]);
          }
        } else {
          setDynamicCards([]);
        }
      } catch (error) {
        console.error("Error fetching Professional Mehendi services:", error);
        setDynamicCards([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDynamicData();
  }, []);

  // Only dynamic services from database (no hardcoded fallback)
  const displayCards = dynamicCards;

  return (
    <ServiceModal
      title="Professional Mehendi"
      cards={displayCards}
      onClose={onClose}
      services={services}
      currentServiceId={currentServiceId}
      onServiceChange={onServiceChange}
      onConfirm={() => alert("Professional Mehendi Booking Confirmed!")}
      source="professional-mehendi"
      loading={loading}
      loadingLayout="cards"
    />
  );
};

export default ProfessionalMehendiModal;
