import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import Root from "./Root"; // Import Root component

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <Root />
    </HashRouter>
  </React.StrictMode>
);