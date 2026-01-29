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
  return {
    img: service.image && service.image.length > 0 ? service.image[0] : null,
    cardHeader: service.name || 'Service',
    description: service.description || '',
    price: service.price?.toString() || '0',
    taxIncluded: service.taxIncluded !== undefined ? service.taxIncluded : true,
    duration: service.duration || 'N/A',
    button: service.ctaContent || 'Add +',
    service_id: service._id?.toString() || service.id?.toString(),
    // Flag to identify dynamic data
    isDynamic: true,
    // Store original service data for reference
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

  // Convert to array format expected by ServiceModal
  return Object.keys(grouped).map(title => ({
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
    
    return {
      img: service.image && service.image.length > 0 ? service.image[0] : null,
      cardHeader: service.name || 'Service',
      serviceCategory: categoryName,
      description: service.description || '',
      // Store raw number so UI adds ₹ once (avoids double rupee symbol)
      PriceEstimate: service.price != null ? service.price : 'Price on request',
      Price: service.price != null ? service.price : null,
      button: service.ctaContent || 'Enquire Now',
      service_id: service._id?.toString() || service.id?.toString(),
      // Set enableAddButton to true for "Add" services so ServiceCartButton is used
      enableAddButton: isAddService,
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
