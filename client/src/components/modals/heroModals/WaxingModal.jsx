/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ServiceModal from "../ServiceModal";
import { categoriesApi } from "../../../features/categories/categoriesApi";
import { transformServicesToGridCard, findCategoryByIdentifier } from "../../../utils/serviceTransformers";

// Hardcoded data - commented out; only dynamic services from DB are shown
// import fullBodyClassic from "../../../assets/modals/waxing/classic/fullBody-classic.png";
// import handsAndLegsClassic from "../../../assets/modals/waxing/classic/handsAndLegs-classic.png";
// import underarmsClassic from "../../../assets/modals/waxing/classic/Underarm.png";
// import faceWaxClassic from "../../../assets/modals/waxing/classic/Face Wax.png";
// import threadingClassic from "../../../assets/modals/waxing/classic/Threading.png";
// import bikiniWaxingPremium from "../../../assets/modals/waxing/premium/bikiniWaxing-premium.png";
// import fullBodyPremium from "../../../assets/modals/waxing/premium/fullBody-premium.png";
// import handsAndLegsPremium from "../../../assets/modals/waxing/premium/handsAndLegs-premium.png";
// const card = [ { title: "Classic", data: [ ... ] }, { title: "Premium", data: [ ... ] } ];

const WaxingModal = ({ onClose, services = [], currentServiceId = null, onServiceChange = null }) => {
  const [dynamicGridCard, setDynamicGridCard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await categoriesApi.getAllCategories();
        const categories = categoriesResponse.data || [];
        const category = findCategoryByIdentifier(categories, "waxing") ||
                        findCategoryByIdentifier(categories, "Waxing");
        if (category && category._id) {
          const servicesResponse = await categoriesApi.getCategoryServices(category._id);
          const categoryServices = servicesResponse.data?.services || [];
          if (categoryServices.length > 0) {
            const transformedGridCard = transformServicesToGridCard(categoryServices);
            setDynamicGridCard(transformedGridCard);
          } else {
            setDynamicGridCard([]);
          }
        } else {
          setDynamicGridCard([]);
        }
      } catch (error) {
        console.error("❌ Error fetching dynamic data for Waxing:", error);
        setDynamicGridCard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDynamicData();
  }, []);

  const displayGridCard = dynamicGridCard;

  const waxingInfo = {
    items: [
      "AC is highly recommended for waxing.",
      "Areas with wound or cuts won't be waxed.",
      "Do share or be aware of any history of reaction due to wax",
      "Wax box will not be handed over to customer",
      "The hair should be minimum 0.25in to be able to wax properly",
    ],
  };

  return (
    <ServiceModal
      title="Waxing"
      gridCard={displayGridCard}
      infoContent={waxingInfo}
      onClose={onClose}
      services={services}
      currentServiceId={currentServiceId}
      onServiceChange={onServiceChange}
      onConfirm={() => alert("Waxing Booking Confirmed!")}
      loading={loading}
      loadingLayout="grid"
    />
  );
};

export default WaxingModal;
