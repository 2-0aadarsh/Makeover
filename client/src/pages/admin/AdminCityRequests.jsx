import { useEffect, useState } from "react";
import Loader from "../../components/common/Loader/loader.jsx";
import AdminPagination from "../../components/admin/common/AdminPagination";
import AddCityConfirmModal from "../../components/modals/admin/AddCityConfirmModal";
import Select from "../../components/ui/Select.jsx";
import { adminCityRequestsApi } from "../../features/admin/cityRequests/adminCityRequestsApi";

const STATUS_OPTIONS = ["pending", "reviewed", "planned", "added", "dismissed"];
const STATUS_SELECT_OPTIONS = [
  { value: "", label: "All statuses" },
  ...STATUS_OPTIONS.map((s) => ({ value: s, label: s })),
];
const SOURCE_OPTIONS = [
  { value: "", label: "All sources" },
  { value: "footer_modal", label: "Web – Footer" },
  { value: "contact_page", label: "Web – Contact" },
];
const SORT_OPTIONS = [
  { value: "demand", order: "desc", label: "Most requested cities" },
  { value: "createdAt", order: "desc", label: "Recent demand" },
  { value: "createdAt", order: "asc", label: "Oldest first" },
  { value: "requestedCity", order: "asc", label: "City A–Z" },
];
const SORT_SELECT_OPTIONS = SORT_OPTIONS.map((opt, i) => ({ value: String(i), label: opt.label }));

const limit = 10;

const AdminCityRequests = ({ hideTitle = false }) => {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit,
    totalEnquiries: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortIndex, setSortIndex] = useState(0); // 0 = Most requested, 1 = Recent, etc.
  const [updatingId, setUpdatingId] = useState(null);
  const [addCityModal, setAddCityModal] = useState(null); // { id, city, state }
  const [addCityModalLoading, setAddCityModalLoading] = useState(false);

  const loadList = async () => {
    setLoading(true);
    setError(null);
    const sort = SORT_OPTIONS[Number(sortIndex)] || SORT_OPTIONS[0];
    try {
      const res = await adminCityRequestsApi.getAll({
        page,
        limit,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
        city: cityFilter.trim() || undefined,
        state: stateFilter.trim() || undefined,
        source: sourceFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy: sort.value,
        sortOrder: sort.order,
      });
      setRequests(res.data?.requests ?? []);
      const p = res.data?.pagination;
      if (p) {
        setPagination({
          currentPage: p.currentPage ?? page,
          totalPages: p.totalPages ?? 1,
          limit: p.limit ?? limit,
          totalEnquiries: p.total ?? 0,
          hasNextPage: p.hasNextPage ?? false,
          hasPrevPage: p.hasPrevPage ?? false,
        });
      }
    } catch (e) {
      setError(e.message || "Failed to load city requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAnalytics = async () => {
    try {
      const res = await adminCityRequestsApi.getAnalytics();
      setAnalytics(res.data ?? null);
    } catch (_) {
      setAnalytics(null);
    }
  };

  // Refetch when page or any filter/sort changes (search is handled by debounce below)
  useEffect(() => {
    loadList();
  }, [page, statusFilter, cityFilter, stateFilter, sourceFilter, startDate, endDate, sortIndex]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (page === 1) loadList();
      else setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const handleStatusChange = async (id, newStatus, request) => {
    if (newStatus === "added") {
      setAddCityModal({
        id,
        city: request?.requestedCity,
        state: request?.requestedState,
      });
      return;
    }
    setUpdatingId(id);
    try {
      await adminCityRequestsApi.updateStatus(id, { status: newStatus });
      setStatusFilter("");
      setPage(1);
      await loadAnalytics();
    } catch (e) {
      // optional: toast
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddCityConfirm = async (coveragePincodes) => {
    if (!addCityModal?.id || !Array.isArray(coveragePincodes) || coveragePincodes.length === 0) return;
    setAddCityModalLoading(true);
    try {
      await adminCityRequestsApi.addToServiceable(addCityModal.id, { coveragePincodes });
      setAddCityModal(null);
      setStatusFilter("");
      setPage(1);
      await loadAnalytics();
      await loadList();
    } catch (e) {
      // optional: toast
    } finally {
      setAddCityModalLoading(false);
    }
  };

  return (
    <div className={hideTitle ? "" : "min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]"}>
      {!hideTitle && (
        <h1 className="text-3xl font-bold mb-8 font-sans" style={{ fontSize: "30px", fontWeight: 700, color: "#CC2B52" }}>
          City requests
        </h1>
      )}

      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-[#CC2B52]">{analytics.total ?? 0}</div>
            <div className="text-sm text-gray-500">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-amber-600">{analytics.byStatus?.pending ?? 0}</div>
            <div className="text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-blue-600">{analytics.byStatus?.added ?? 0}</div>
            <div className="text-sm text-gray-500">Added</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-2xl font-bold text-gray-600">{analytics.topRequestedCities?.[0]?.city ?? "—"}</div>
            <div className="text-sm text-gray-500">Top requested</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search city, name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] text-sm py-2 px-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52]"
          />
          <div className="min-w-[140px]">
            <Select
              showLabel={false}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={STATUS_SELECT_OPTIONS}
              placeholder="All statuses"
              height="40px"
            />
          </div>
          <div className="min-w-[140px]">
            <Select
              showLabel={false}
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              options={[
                { value: "", label: "All cities" },
                ...(analytics?.distinctCities || []).map((c) => ({ value: c, label: c })),
              ]}
              placeholder="All cities"
              height="40px"
            />
          </div>
          <div className="min-w-[140px]">
            <Select
              showLabel={false}
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              options={[
                { value: "", label: "All states" },
                ...(analytics?.distinctStates || []).map((s) => ({ value: s, label: s })),
              ]}
              placeholder="All states"
              height="40px"
            />
          </div>
          <div className="min-w-[140px]">
            <Select
              showLabel={false}
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              options={SOURCE_OPTIONS}
              placeholder="All sources"
              height="40px"
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-sm py-2 px-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52] outline-none"
              title="From date"
            />
            <span className="text-gray-400">–</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-sm py-2 px-2 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52] outline-none"
              title="To date"
            />
          </div>
          <div className="min-w-[180px]">
            <Select
              showLabel={false}
              value={String(sortIndex)}
              onChange={(e) => setSortIndex(Number(e.target.value))}
              options={SORT_SELECT_OPTIONS}
              placeholder="Sort by"
              height="40px"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="large" />
          </div>
        ) : error ? (
          <p className="p-6 text-red-600">{error}</p>
        ) : requests.length === 0 ? (
          <p className="p-6 text-gray-500">No city requests found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Requester</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4 text-gray-600">{r.requestNumber}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium">{r.requestedCity}</span>
                        {r.requestedState && <span className="text-gray-500">, {r.requestedState}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <div>{r.userDetails?.name}</div>
                        <div className="text-gray-500 text-xs">{r.userDetails?.email}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">
                        {r.source === "contact_page" ? "Contact" : "Footer"}
                      </td>
                      <td className="py-3 px-4">
                        <Select
                          showLabel={false}
                          value={r.status}
                          onChange={(e) => handleStatusChange(r._id, e.target.value, r)}
                          disabled={updatingId === r._id}
                          options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                          placeholder="Status"
                          height="36px"
                          className="min-w-[110px]"
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination.totalPages > 1 && (
              <AdminPagination pagination={pagination} onPageChange={setPage} />
            )}
          </>
        )}
      </div>

      <AddCityConfirmModal
        isOpen={!!addCityModal}
        onClose={() => setAddCityModal(null)}
        onConfirm={handleAddCityConfirm}
        cityName={addCityModal?.city}
        stateName={addCityModal?.state}
        loading={addCityModalLoading}
      />
    </div>
  );
};

export default AdminCityRequests;
