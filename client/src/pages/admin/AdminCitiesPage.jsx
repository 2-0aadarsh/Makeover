import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader/loader.jsx";
import Select from "../../components/ui/Select.jsx";
import AdminCityRequests from "./AdminCityRequests";
import { adminServiceableCitiesApi } from "../../features/admin/serviceableCities/adminServiceableCitiesApi";
import useBodyScrollLock from "../../hooks/useBodyScrollLock";

const STATUS_FILTER_OPTIONS = [
  { value: "", label: "All" },
  { value: "active", label: "Active only" },
  { value: "inactive", label: "Inactive only" },
];
const inputClass =
  "w-full text-sm py-2 px-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#CC2B52] focus:border-[#CC2B52] outline-none";

const TABS = [
  { key: "serviceable", label: "Serviceable cities" },
  { key: "requests", label: "City requests" },
];

const AdminCitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab = TABS.some((t) => t.key === tabParam) ? tabParam : "serviceable";
  const [cities, setCities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(""); // active | inactive | ''
  const [page, setPage] = useState(1);
  const [togglingId, setTogglingId] = useState(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ city: "", state: "", displayName: "" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);
  const limit = 20;

  useBodyScrollLock(addModalOpen);

  const loadCities = async () => {
    if (tab !== "serviceable") return;
    setLoading(true);
    try {
      const res = await adminServiceableCitiesApi.getAll({
        page,
        limit,
        status: statusFilter || undefined,
        sort: "-priority",
      });
      setCities(res.data ?? []);
    } catch (e) {
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const res = await adminServiceableCitiesApi.getStats();
      setStats(res.data ?? null);
    } catch (_) {
      setStats(null);
    }
  };

  useEffect(() => {
    loadCities();
  }, [tab, page, statusFilter]);

  useEffect(() => {
    if (tab === "serviceable") loadStats();
  }, [tab]);

  const handleToggleStatus = async (id) => {
    setTogglingId(id);
    try {
      await adminServiceableCitiesApi.toggle(id);
      await loadCities();
      await loadStats();
      toast.success("Status updated");
    } catch (e) {
      toast.error(e || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    const city = addForm.city?.trim();
    const state = addForm.state?.trim();
    if (!city || !state) {
      setAddError("City and state are required.");
      return;
    }
    setAddError(null);
    setAddLoading(true);
    try {
      await adminServiceableCitiesApi.create({
        city,
        state,
        displayName: addForm.displayName?.trim() || undefined,
      });
      toast.success(`${city}, ${state} added to serviceable cities`);
      setAddModalOpen(false);
      setAddForm({ city: "", state: "", displayName: "" });
      await loadCities();
      await loadStats();
    } catch (e) {
      setAddError(typeof e === "string" ? e : "Failed to add city. It may already exist.");
      toast.error(typeof e === "string" ? e : "Failed to add city");
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 lg:p-8 lg:px-[80px]">
      <h1
        className="text-3xl font-bold mb-6 font-sans"
        style={{ fontSize: "30px", fontWeight: 700, color: "#CC2B52" }}
      >
        Cities
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setSearchParams({ tab: t.key })}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t.key
                ? "bg-white border border-b-0 border-gray-200 text-[#CC2B52] -mb-px"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "serviceable" && (
        <>
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-[#CC2B52]">{stats.totalCities ?? 0}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-green-600">{stats.activeCities ?? 0}</div>
                <div className="text-sm text-gray-500">Active</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-gray-500">{stats.inactiveCities ?? 0}</div>
                <div className="text-sm text-gray-500">Inactive</div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.totalBookings ?? 0}</div>
                <div className="text-sm text-gray-500">Total bookings</div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-200">
              <div className="min-w-[140px]">
                <Select
                  showLabel={false}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={STATUS_FILTER_OPTIONS}
                  placeholder="All"
                  height="40px"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  setAddModalOpen(true);
                  setAddError(null);
                  setAddForm({ city: "", state: "", displayName: "" });
                }}
                className="ml-auto px-4 py-2 rounded-lg text-sm font-medium bg-[#CC2B52] text-white hover:bg-[#CC2B52]/90 transition-colors"
              >
                Add city
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader size="large" />
              </div>
            ) : cities.length === 0 ? (
              <p className="p-6 text-gray-500">No serviceable cities found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">City</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">State</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Display name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map((c) => (
                      <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-medium">{c.city}</td>
                        <td className="py-3 px-4 text-gray-600">{c.state}</td>
                        <td className="py-3 px-4 text-gray-600">{c.displayName || "—"}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                              c.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {c.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(c._id)}
                            disabled={togglingId === c._id}
                            className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors disabled:opacity-60 ${
                              c.isActive
                                ? "border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100"
                                : "border-green-300 text-green-700 bg-green-50 hover:bg-green-100"
                            }`}
                          >
                            {togglingId === c._id ? "Updating…" : c.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {tab === "requests" && <AdminCityRequests hideTitle />}

      {/* Add serviceable city modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden overscroll-contain">
          <div
            className="absolute inset-0 bg-black/50"
            aria-hidden="true"
            onClick={() => !addLoading && setAddModalOpen(false)}
          />
          <div
            className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-city-modal-title"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 id="add-city-modal-title" className="text-lg font-semibold text-gray-900">
                Add serviceable city
              </h2>
              <button
                type="button"
                onClick={() => !addLoading && setAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddCity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input
                  type="text"
                  value={addForm.city}
                  onChange={(e) => setAddForm((p) => ({ ...p, city: e.target.value }))}
                  placeholder="e.g. Mumbai"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input
                  type="text"
                  value={addForm.state}
                  onChange={(e) => setAddForm((p) => ({ ...p, state: e.target.value }))}
                  placeholder="e.g. Maharashtra"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display name (optional)</label>
                <input
                  type="text"
                  value={addForm.displayName}
                  onChange={(e) => setAddForm((p) => ({ ...p, displayName: e.target.value }))}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className={inputClass}
                />
              </div>
              {addError && (
                <p className="text-sm text-red-600">{addError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  disabled={addLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-[#CC2B52] hover:bg-[#CC2B52]/90 disabled:opacity-60"
                >
                  {addLoading ? "Adding…" : "Add city"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCitiesPage;
