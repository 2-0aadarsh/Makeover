import { SERVICE_TYPE_DISPLAY_ORDER } from '../constants';

/**
 * Utility functions to transform database service/category data
 * to match the modal component's expected format
 */

/**
 * Transform a database service to modal card format
 * @param {Object} service - Service from database
 * @returns {Object} Transformed service card
 */
export const transformServiceToCard = (service) => {
  // Use priceDisplay when set (e.g. "2.5k-4k", "Get in touch for pricing"); else numeric price
  const displayPrice = service.priceDisplay != null && String(service.priceDisplay).trim() !== ''
    ? service.priceDisplay
    : (service.price != null ? service.price : 'Get in touch for pricing');
  const isAvailable = service.isAvailable !== false;
  return {
    img: service.image && service.image.length > 0 ? service.image[0] : null,
    cardHeader: service.name || 'Service',
    description: service.description || '',
    price: typeof displayPrice === 'number' ? displayPrice.toString() : displayPrice,
    taxIncluded: service.taxIncluded !== undefined ? service.taxIncluded : true,
    duration: service.duration || 'N/A',
    button: service.ctaContent || 'Add +',
    service_id: service._id?.toString() || service.id?.toString(),
    isAvailable,
    isDynamic: true,
    originalService: service
  };
};

/**
 * Transform services grouped by serviceType to gridCard format
 * @param {Array} services - Array of services from database
 * @returns {Array} Array of gridCard objects with title and data
 */
export const transformServicesToGridCard = (services) => {
  if (!services || services.length === 0) {
    return [];
  }

  // Group services by serviceType
  const grouped = services.reduce((acc, service) => {
    const type = service.serviceType || 'Standard';
    // Map serviceType to modal tab names
    const tabName = mapServiceTypeToTab(type);
    
    if (!acc[tabName]) {
      acc[tabName] = [];
    }
    
    acc[tabName].push(transformServiceToCard(service));
    return acc;
  }, {});

  // Convert to array in display order (Regular → Classic → Premium → Bridal); unknown types last
  const orderedTitles = Object.keys(grouped).sort((a, b) => {
    const i = SERVICE_TYPE_DISPLAY_ORDER.indexOf(a);
    const j = SERVICE_TYPE_DISPLAY_ORDER.indexOf(b);
    const orderA = i === -1 ? SERVICE_TYPE_DISPLAY_ORDER.length : i;
    const orderB = j === -1 ? SERVICE_TYPE_DISPLAY_ORDER.length : j;
    return orderA - orderB;
  });
  return orderedTitles.map(title => ({
    title,
    data: grouped[title]
  }));
};

/**
 * Map database serviceType to modal tab names
 * @param {string} serviceType - Service type from database
 * @returns {string} Tab name for modal
 */
const mapServiceTypeToTab = (serviceType) => {
  const mapping = {
    'Standard': 'Regular',
    'Premium': 'Premium',
    'Bridal': 'Bridal',
    'Classic': 'Classic',
    'Regular': 'Regular',
    // Add more mappings as needed
  };
  
  return mapping[serviceType] || 'Regular';
};

/**
 * Transform services to flex card format (for ProfessionalMakeup style modals)
 * @param {Array} services - Array of services from database
 * @param {string} categoryName - Category name
 * @returns {Array} Array of flex card objects
 */
export const transformServicesToFlexCards = (services, categoryName = '') => {
  if (!services || services.length === 0) {
    return [];
  }

  return services.map(service => {
    const isAddService = service.ctaContent === 'Add' || service.ctaContent === 'Add +';
    // Use priceDisplay when set (e.g. "2.5k-4k", "Get in touch for pricing"); else numeric price or "Price on request"
    const displayPrice = service.priceDisplay != null && String(service.priceDisplay).trim() !== ''
      ? service.priceDisplay
      : (service.price != null && service.price !== '' ? service.price : 'Get in touch for pricing');
    const isAvailable = service.isAvailable !== false;
    return {
      img: service.image && service.image.length > 0 ? service.image[0] : null,
      cardHeader: service.name || 'Service',
      serviceCategory: categoryName,
      description: service.description || '',
      PriceEstimate: displayPrice,
      Price: typeof displayPrice === 'number' ? displayPrice : null,
      includingTax: service.taxIncluded !== undefined ? service.taxIncluded : true,
      button: service.ctaContent || 'Enquire Now',
      service_id: service._id?.toString() || service.id?.toString(),
      enableAddButton: isAddService && isAvailable,
      isAvailable,
      isDynamic: true,
      originalService: service
    };
  });
};

/**
 * Find category by slug or name
 * @param {Array} categories - Array of categories
 * @param {string} identifier - Category slug or name
 * @returns {Object|null} Category object or null
 */
export const findCategoryByIdentifier = (categories, identifier) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  return categories.find(
    cat => 
      cat.slug === identifier || 
      cat.name === identifier ||
      cat._id?.toString() === identifier ||
      cat.id?.toString() === identifier
  ) || null;
};
