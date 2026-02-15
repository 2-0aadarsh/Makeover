/* eslint-disable react/prop-types */

/**
 * AdminPagination - Pagination component matching Figma design
 * Shows "Showing data X to Y of Z entries" on left, pagination controls on right
 */
const AdminPagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, limit, totalBookings, totalCustomers, totalEnquiries, totalReviews, totalMessages, hasNextPage, hasPrevPage } = pagination;
  const totalItems = totalBookings || totalCustomers || totalEnquiries || totalReviews || totalMessages || 0;
  const startItem = ((currentPage - 1) * limit) + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  if (totalPages <= 1) {
    return null;
  }

  // Format large numbers (e.g., 256000 -> 256K)
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
      {/* Left: Entry count */}
      <div
        className="text-sm"
        style={{
          fontFamily: 'Poppins',
          fontSize: '14px',
          fontWeight: 400,
          color: '#3D3C42',
        }}
      >
        Showing data {startItem.toLocaleString()} to {endItem.toLocaleString()} of {formatNumber(totalItems)} entries
      </div>

      {/* Right: Pagination controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className={`px-3 py-1 rounded ${
            hasPrevPage
              ? 'text-gray-700 hover:bg-gray-200'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'Poppins', fontSize: '14px' }}
        >
          &lt;
        </button>
        
        {/* Page numbers */}
        {[...Array(Math.min(4, totalPages))].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1 rounded ${
                pageNum === currentPage
                  ? 'bg-[#CC2B52] text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              style={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: 500 }}
            >
              {pageNum}
            </button>
          );
        })}
        
        {totalPages > 4 && (
          <>
            <span className="text-gray-400" style={{ fontFamily: 'Poppins', fontSize: '14px' }}>...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className={`px-3 py-1 rounded ${
                totalPages === currentPage
                  ? 'bg-[#CC2B52] text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              style={{ fontFamily: 'Poppins', fontSize: '14px', fontWeight: 500 }}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className={`px-3 py-1 rounded ${
            hasNextPage
              ? 'text-gray-700 hover:bg-gray-200'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'Poppins', fontSize: '14px' }}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
