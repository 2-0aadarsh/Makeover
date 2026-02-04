/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ServiceModal from "../ServiceModal";
import { categoriesApi } from "../../../features/categories/categoriesApi";
import { transformServicesToGridCard, findCategoryByIdentifier } from "../../../utils/serviceTransformers";

// Hardcoded data - commented out; only dynamic services from DB are shown
// import ManicureClassic from "../../../assets/modals//manicure and pedicure/classic/Manicure-classic.png";
// import PedicureClassic from "../../../assets/modals//manicure and pedicure/classic/Pedicure-classic.png";
// import FootMassageClassic from "../../../assets/modals//manicure and pedicure/classic/Foot Massage.png";
// import HeadNeckMassageClassic from "../../../assets/modals//manicure and pedicure/classic/Head & Neck  Massage.png";
// import FullBodyMassageClassic from "../../../assets/modals//manicure and pedicure/classic/Full Body  Massage.png";
// import ManicurePremium from "../../../assets/modals/manicure and pedicure/premium/Manicure-premium.png";
// import PedicurePremium from "../../../assets/modals/manicure and pedicure/premium/Pedicure-premium.png";
// import PremiumMassage from "../../../assets/modals/manicure and pedicure/premium/Premium Massage.png";
// const card = [ { title: "Classic", data: [ ... ] }, { title: "Premium", data: [ ... ] } ];

const ManicureAndPedicureModal = ({ onClose, services = [], currentServiceId = null, onServiceChange = null }) => {
  const [dynamicGridCard, setDynamicGridCard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setLoading(true);
        const categoriesResponse = await categoriesApi.getAllCategories();
        const categories = categoriesResponse.data || [];
        const category = findCategoryByIdentifier(categories, "manicure-pedicure") ||
                        findCategoryByIdentifier(categories, "manicure-and-pedicure") ||
                        findCategoryByIdentifier(categories, "Mani/Pedi & Massage") ||
                        findCategoryByIdentifier(categories, "Manicure and Pedicure");
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
        console.error("❌ Error fetching dynamic data for Mani/Pedi & Massage:", error);
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
      title="Mani/Pedi & Massage"
      gridCard={displayGridCard}
      onClose={onClose}
      services={services}
      currentServiceId={currentServiceId}
      onServiceChange={onServiceChange}
      onConfirm={() => alert("Mani/Pedi & Massage Booking Confirmed!")}
      loading={loading}
      loadingLayout="grid"
    />
  );
};

export default ManicureAndPedicureModal;
