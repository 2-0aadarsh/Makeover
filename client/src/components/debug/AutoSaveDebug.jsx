import { useSelector } from "react-redux";

const AutoSaveDebug = () => {
  const cartState = useSelector((state) => state.cart);
  const authState = useSelector((state) => state.auth);

  const handleManualTrigger = () => {
    if (window.triggerAutoSave) {
      console.log("🔄 Debug - Manually triggering auto-save");
      window.triggerAutoSave();
    }
  };

  const handleForceSave = () => {
    if (window.forceSaveCart) {
      console.log("🔄 Debug - Manually triggering force save");
      window.forceSaveCart();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "white",
        border: "1px solid #ccc",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <h4>Auto-Save Debug</h4>
      <div>
        <strong>Auth Status:</strong>{" "}
        {authState.isAuthenticated
          ? "✅ Authenticated"
          : "❌ Not Authenticated"}
      </div>
      <div>
        <strong>Auth State:</strong> {authState.status}
      </div>
      <div>
        <strong>User:</strong> {authState.user ? authState.user.name : "None"}
      </div>
      <div>
        <strong>Cart Items:</strong> {cartState.items.length}
      </div>
      <div>
        <strong>Last Updated:</strong> {cartState.lastUpdated || "Never"}
      </div>
      <div>
        <strong>Total Items:</strong> {cartState.summary.totalItems}
      </div>
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={handleManualTrigger}
          style={{ marginRight: "5px", fontSize: "10px", padding: "2px 5px" }}
        >
          Trigger Auto-Save
        </button>
        <button
          onClick={handleForceSave}
          style={{ fontSize: "10px", padding: "2px 5px" }}
        >
          Force Save
        </button>
      </div>
    </div>
  );
};

export default AutoSaveDebug;
