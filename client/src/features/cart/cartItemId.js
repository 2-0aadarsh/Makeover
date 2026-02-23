// /**
//  * Single source of truth for cart item ID.
//  * Used by cartSlice, ServiceCartButton, and selectors so add/update/quantity
//  * always use the same id (including optionIndex when present).
//  *
//  * @param {Object} serviceData - Service/card payload (service_id or serviceId, optional optionIndex, cardHeader, price, category)
//  * @returns {string} Cart item id
//  */
// export const getCartItemId = (serviceData) => {
//   const baseId = serviceData.service_id || serviceData.serviceId;
//   if (baseId && (serviceData.optionIndex !== undefined && serviceData.optionIndex !== null)) {
//     return `${baseId}_opt_${serviceData.optionIndex}`;
//   }
//   if (baseId) return baseId;
//   return `${serviceData.cardHeader}_${serviceData.price}_${serviceData.category || 'default'}`;
// };


/**
 * Get a single cart item ID from backend-derived service data.
 * Use only the id set at transform time (serviceId / service_id). No building from optionIndex.
 *
 * @param {Object} serviceData - Service/card payload (must have serviceId or service_id set from backend transform)
 * @returns {string} Cart item id
 */
export const getCartItemId = (serviceData) => {
  const id = serviceData.serviceId ?? serviceData.service_id;
  if (id && typeof id === "string" && id.trim().length > 0) {
    return id.trim();
  }
  return `${serviceData.cardHeader ?? ""}_${serviceData.price ?? 0}_${serviceData.category ?? "default"}`;
};
