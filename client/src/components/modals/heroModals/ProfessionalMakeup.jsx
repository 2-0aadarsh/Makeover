import { useEffect, useState } from "react";
import ServiceModal from "../ServiceModal";
import { categoriesApi } from "../../../features/categories/categoriesApi";
import { transformServicesToFlexCards, findCategoryByIdentifier } from "../../../utils/serviceTransformers";

// Hardcoded data - commented out; only dynamic services from DB are shown
// import BridalMakeup from "../../../assets/modals/professional makeup/BridalMakeup.png";
// import EngagementMakeup from "../../../assets/modals/professional makeup/EngagementMakeup2.png";
// import PartyMakeup from "../../../assets/modals/professional makeup/PartyMakeup.png";
// const hardcodedMakeupCard = [
//   { img: BridalMakeup, cardHeader: "Bridal Makeup", serviceCategory: "Professional Makeup", description: "We create the most elegant bridal looks! Contact us to book yours today.", PriceEstimate: "12k-28k", button: "Enquire Now" },
//   { img: PartyMakeup, cardHeader: "Party Makeup", serviceCategory: "Professional Makeup", description: "A flawless look crafted to enhance your features and keep you glowing", PriceEstimate: "2.5k-4k", button: "Enquire Now" },
//   { img: EngagementMakeup, cardHeader: "Engagement/Reception", serviceCategory: "Professional Makeup", description: "Seamless looks by our professionals! Contact us to book yours today.", PriceEstimate: "10k-16k", button: "Enquire Now" },
// ];

const ProfessionalMakeup = ({ onClose, services = [], currentServiceId = null, onServiceChange = null }) => {
  const [dynamicCards, setDynamicCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState(null);

  // Fetch dynamic data
  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setLoading(true);
        
        // First, get all categories to find "Professional Makeup"
        const categoriesResponse = await categoriesApi.getAllCategories();
        const categories = categoriesResponse.data || [];
        
        // Find category by slug or name
        const category = findCategoryByIdentifier(categories, "professional-makeup") || 
                        findCategoryByIdentifier(categories, "Professional Makeup");
        
        if (category && category._id) {
          setCategoryId(category._id);
          
          // Fetch services for this category
          const servicesResponse = await categoriesApi.getCategoryServices(category._id);
          const categoryServices = servicesResponse.data?.services || [];
          
          if (categoryServices.length > 0) {
            // Transform services to flex card format
            const transformedCards = transformServicesToFlexCards(
              categoryServices,
              category.name
            );
            setDynamicCards(transformedCards);
            console.log("✅ Dynamic data loaded for Professional Makeup:", transformedCards);
          } else {
            console.log("⚠️ No services found for Professional Makeup category");
            setDynamicCards([]);
          }
        } else {
          console.log("⚠️ Professional Makeup category not found in database");
          setDynamicCards([]);
        }
      } catch (error) {
        console.error("❌ Error fetching dynamic data for Professional Makeup:", error);
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
      title="Professional Makeup"
      description="Get camera-ready with flawless makeup done by our expert artists."
      cards={displayCards}
      onClose={onClose}
      services={services}
      currentServiceId={currentServiceId}
      onServiceChange={onServiceChange}
      onConfirm={() => alert("Professional Makeup Booking Confirmed!")}
      source="professional-makeup"
      loading={loading}
      loadingLayout="cards"
    />
  );
};

export default ProfessionalMakeup;
