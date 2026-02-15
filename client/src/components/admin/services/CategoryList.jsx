/* eslint-disable react/prop-types */

/**
 * CategoryList - List component for displaying categories
 * Shows categories in a dropdown-style list
 */
const CategoryList = ({ categories = [], onCategorySelect, selectedCategoryId }) => {
  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p className="text-gray-500 text-sm">No categories found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {categories.map((category, index) => (
        <div
          key={category.id || category._id || index}
          onClick={() => onCategorySelect && onCategorySelect(category)}
          className={`px-4 py-3 border-b border-gray-200 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors ${
            selectedCategoryId === (category.id || category._id) ? 'bg-gray-50' : ''
          }`}
        >
          <span
            style={{
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontWeight: 500,
              color: '#292D32',
            }}
          >
            {category.name || 'N/A'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
