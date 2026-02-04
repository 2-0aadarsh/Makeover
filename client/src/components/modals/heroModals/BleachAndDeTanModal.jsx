/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ServiceModal from "../ServiceModal";
import { categoriesApi } from "../../../features/categories/categoriesApi";
import { transformServicesToGridCard, findCategoryByIdentifier } from "../../../utils/serviceTransformers";

// Hardcoded data - commented out; only dynamic services from DB are shown
// import faceAndNeckBleach from "../../../assets/modals/bleach and de-tan/classic/faceAndNeckBleach.png";
// import handsAndLegsBleach from "../../../assets/modals/bleach and de-tan/classic/handsAndLegsBleach.png";
// import faceAndNeckDetan from "../../../assets/modals/bleach and de-tan/classic/faceAndNeckDetan.png";
// import handsAndLegsDetan from "../../../assets/modals/bleach and de-tan/classic/handsAndLegsDetan.png";
// import fullBodyDetan from "../../../assets/modals/bleach and de-tan/classic/fullBodyDetan.png";
// import fullBodyPolish from "../../../assets/modals/bleach and de-tan/premium/fullBodyPolish.svg";
// const card = [ { title: "Classic", data: [ ... ] }, { title: "Premium", data: [ ... ] } ];

const BleachAndDeTanModal = ({ onClose, services = [], currentServiceId = null, onServiceChange = null }) => {
  const [dynamicGridCard, setDynamicGridCard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await categoriesApi.getAllCategories();
        const categories = categoriesResponse.data || [];
        const category = findCategoryByIdentifier(categories, "bleach-detan") ||
                        findCategoryByIdentifier(categories, "bleach-and-detan") ||
                        findCategoryByIdentifier(categories, "Detan & Bleach") ||
                        findCategoryByIdentifier(categories, "Bleach and De-Tan");
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
        console.error("❌ Error fetching dynamic data for Detan & Bleach:", error);
        setDynamicGridCard([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDynamicData();
  }, []);

  const displayGridCard = dynamicGridCard;

  return (
    <ServiceModal
      title="Detan & Bleach"
      gridCard={displayGridCard}
      onClose={onClose}
      services={services}
      currentServiceId={currentServiceId}
      onServiceChange={onServiceChange}
      onConfirm={() => alert("Detan & Bleach Booking Confirmed!")}
      source="bleach-detan"
      loading={loading}
      loadingLayout="grid"
    />
  );
};

export default BleachAndDeTanModal;