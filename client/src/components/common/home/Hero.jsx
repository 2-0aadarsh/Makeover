import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import artistImg from "../../../assets/hero/artist.png";
import faceFoundationImg from "../../../assets/hero/faceFoundation.png";
import tattooImg from "../../../assets/hero/tattoo.png";
import naturalIngridentsImg from "../../../assets/hero/naturalIngridents.png";
import primerImg from "../../../assets/hero/primer.png";
import makeupImg from "../../../assets/hero/makeup.png";

// Neutral placeholder when hero image is missing or fails to load (no hardcoded hero asset)
const HERO_PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
import { fetchPublicSiteSettings } from "../../../features/admin/siteSettings/siteSettingsThunks";

import ProfessionalMakeup from "../../modals/heroModals/ProfessionalMakeup";
import CleanupAndFacialModal from "../../modals/heroModals/CleanupAndFacialModal";
import ProfessionalMehendiModal from "../../modals/heroModals/ProfessionalMehendiModal";
import WaxingModal from "../../modals/heroModals/WaxingModal";
import ManicureAndPedicureModal from "../../modals/heroModals/ManicureAndPedicureModal";
import BleachAndDeTanModal from "../../modals/heroModals/BleachAndDeTanModal";

const Hero = () => {
  const dispatch = useDispatch();
  const { publicSettings, loading: siteSettingsLoading } = useSelector((state) => state.adminSiteSettings);
  
  const [activeModalId, setActiveModalId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  // Hero image: dynamic only (from site settings), no hardcoded fallback
  const heroImageUrl = publicSettings?.hero?.mainImage ?? "";
  const showHeroLoading = siteSettingsLoading && !publicSettings;
  const hasHeroImage = Boolean(heroImageUrl && heroImageUrl.trim());

  const closeModal = () => setActiveModalId(null);

  const handleServiceChange = (serviceId) => {
    setActiveModalId(serviceId);
  };

  // Define services list for dropdown (used inside the hardcoded modals)
  const servicesList = [
    { id: 1, name: "Professional Makeup" },
    { id: 2, name: "Cleanup & Facial" },
    { id: 3, name: "Professional Mehendi" },
    { id: 4, name: "Waxing" },
    { id: 5, name: "Mani/Pedi & Massage" },
    { id: 6, name: "Detan & Bleach" },
  ];

  // Hardcoded categories configuration (these will always show if they exist in DB)
  const hardcodedCategories = [
    {
      id: 1,
      name: "Professional Makeup",
      image: artistImg,
      modal: <ProfessionalMakeup onClose={closeModal} services={servicesList} currentServiceId={1} onServiceChange={handleServiceChange} />,
    },
    {
      id: 2,
      name: "Cleanup & Facial",
      image: faceFoundationImg,
      modal: <CleanupAndFacialModal onClose={closeModal} services={servicesList} currentServiceId={2} onServiceChange={handleServiceChange} />,
    },
    {
      id: 3,
      name: "Professional Mehendi",
      image: tattooImg,
      modal: <ProfessionalMehendiModal onClose={closeModal} services={servicesList} currentServiceId={3} onServiceChange={handleServiceChange} />,
    },
    {
      id: 4,
      name: "Waxing",
      image: naturalIngridentsImg,
      modal: <WaxingModal onClose={closeModal} services={servicesList} currentServiceId={4} onServiceChange={handleServiceChange} />,
    },
    {
      id: 5,
      name: "Mani/Pedi & Massage",
      image: primerImg,
      modal: <ManicureAndPedicureModal onClose={closeModal} services={servicesList} currentServiceId={5} onServiceChange={handleServiceChange} />,
    },
    {
      id: 6,
      name: "Detan & Bleach",
      image: makeupImg,
      modal: <BleachAndDeTanModal onClose={closeModal} services={servicesList} currentServiceId={6} onServiceChange={handleServiceChange} />,
    },
  ];

  // Fetch site settings for hero image (public API)
  useEffect(() => {
    dispatch(fetchPublicSiteSettings());
  }, [dispatch]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const result = await response.json();
        
        if (result.success && result.data) {
          // Match hardcoded categories with DB categories by name (case-insensitive)
          const dbCategories = result.data;
          const matchedHardcoded = hardcodedCategories.map((hardcoded) => {
            const dbMatch = dbCategories.find(
              (dbCat) => dbCat.name.toLowerCase().trim() === hardcoded.name.toLowerCase().trim()
            );
            
            if (dbMatch) {
              // Use DB image if available, otherwise use hardcoded image
              return {
                ...hardcoded,
                dbId: dbMatch._id || dbMatch.id,
                image: dbMatch.image || hardcoded.image,
                name: dbMatch.name, // Use DB name in case of slight variations
              };
            }
            // If not found in DB, still show with hardcoded image
            return hardcoded;
          });

          // Find additional categories that are not in hardcoded list
          const additionalCategories = dbCategories
            .filter((dbCat) => {
              return !hardcodedCategories.some(
                (hardcoded) => hardcoded.name.toLowerCase().trim() === dbCat.name.toLowerCase().trim()
              );
            })
            .map((dbCat, index) => ({
              id: `dynamic-${dbCat._id || dbCat.id}`,
              dbId: dbCat._id || dbCat.id,
              name: dbCat.name,
              image: dbCat.image || artistImg, // Fallback to default image
              isDynamic: true,
              modal: null, // No custom modal for dynamic categories
            }));

          // Combine: hardcoded first (in order), then additional ones
          setCategories([...matchedHardcoded, ...additionalCategories]);
        } else {
          // Fallback to hardcoded if API fails
          setCategories(hardcodedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to hardcoded categories on error
        setCategories(hardcodedCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category click
  const handleCategoryClick = (category) => {
    if (category.isDynamic) {
      // For dynamic categories without custom modals, you can:
      // Option 1: Navigate to a services page (if you have one)
      // navigate(`/services?category=${category.dbId}`);
      
      // Option 2: Show a simple message (for now)
      // You can customize this behavior later
      console.log(`Dynamic category clicked: ${category.name}`);
      // For now, do nothing - you can add navigation or modal later
    } else {
      // For hardcoded categories, show their custom modal
      setActiveModalId(category.id);
    }
  };

  return (
    <main
      id="hero"
      className="w-full flex flex-col lg:flex-row min-h-[350px] sm:min-h-[450px] md:min-h-[550px] lg:h-[700px] lg:items-center lg:justify-between"
    >
      {/* Hero Image Section – dynamic only (Admin → Site Settings → Hero); no hardcoded image */}
      <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:w-1/2 lg:h-full flex items-center justify-center order-1 lg:order-1 bg-gray-100">
        {showHeroLoading ? (
          <div className="w-full h-full animate-pulse bg-gray-200" aria-hidden />
        ) : hasHeroImage ? (
          <img
            src={heroImageUrl}
            alt="Hero"
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.src = HERO_PLACEHOLDER;
            }}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #FDF2F4 0%, #FCE7EB 40%, #F7EBEE 100%)",
            }}
            aria-hidden
          >
            {/* Subtle decorative circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[70%] h-[70%] rounded-full bg-[#CC2B52]/[0.04] blur-2xl" />
              <div className="absolute w-[50%] h-[50%] rounded-full bg-[#CC2B52]/[0.06] blur-xl -translate-y-1/4" />
            </div>
            <div className="relative flex flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#CC2B52]/10 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#CC2B52]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-[#CC2B52]/70 font-medium text-sm sm:text-base max-w-[220px]">
                Your look, our passion
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section - Mobile/Tablet: Full width, Desktop: Right half */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-[clamp(1rem,4vw,5rem)] py-[clamp(2rem,5vw,3rem)] lg:py-0 order-2 lg:order-2">
        <div className="w-full flex flex-col items-center justify-center gap-[clamp(1.5rem,4vw,2rem)]">
          {/* Header Section */}
          <div className="header flex flex-col items-start justify-center gap-[clamp(1rem,3vw,1.5rem)] text-left w-full">
            <h1 className="title font-semibold text-[clamp(1.5rem,4vw,2.375rem)] text-[#CC2B52] leading-tight">
              Professional Makeup & Grooming at your Doorstep!
            </h1>
            <p className="description font-normal text-[clamp(0.875rem,2vw,1.125rem)] leading-relaxed text-[#292929] max-w-lg">
              We bring professional makeup and grooming essential services to
              you at a very friendly price
            </p>
          </div>

          {/* Services Section */}
          <div className="service-container w-full">
            {loading ? (
              <div className="services grid grid-cols-3 gap-[clamp(0.75rem,2vw,1.5rem)]">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="service-item flex flex-col items-center justify-center p-[clamp(0.5rem,2vw,1rem)] border rounded-xl shadow-md w-full aspect-square animate-pulse bg-gray-100"
                  >
                    <div className="w-[clamp(3rem,8vw,5rem)] h-[clamp(3rem,8vw,5rem)] bg-gray-200 rounded mb-[clamp(0.25rem,1vw,0.5rem)]" />
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="services grid grid-cols-3 gap-[clamp(0.75rem,2vw,1.5rem)]">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="service-item flex flex-col items-center justify-center p-[clamp(0.5rem,2vw,1rem)] border rounded-xl shadow-md w-full aspect-square cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-[clamp(3rem,8vw,5rem)] h-[clamp(3rem,8vw,5rem)] object-cover mb-[clamp(0.25rem,1vw,0.5rem)] rounded"
                      onError={(e) => {
                        // Fallback to default image if image fails to load
                        e.target.src = artistImg;
                      }}
                    />
                    <p className="service-name text-center text-[clamp(0.75rem,1.5vw,1.125rem)] font-medium leading-tight">
                      {category.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Render the active modal if set */}
      {categories.map(
        (category) =>
          category.id === activeModalId && category.modal && (
            <div
              key={category.id}
              className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50 p-[clamp(0.5rem,2vw,1rem)]"
              onClick={closeModal}
            >
              {category.modal}
            </div>
          )
      )}
    </main>
  );
};

export default Hero;