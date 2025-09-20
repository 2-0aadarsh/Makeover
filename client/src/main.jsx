import { createRoot } from "react-dom/client";
import "./index.css";

import React from "react";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./stores/Store.jsx";
import LenisProvider from "./provider/LenisProvider.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LenisProvider>
          <App />
        </LenisProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
