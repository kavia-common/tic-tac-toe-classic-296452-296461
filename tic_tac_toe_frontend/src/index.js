import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/**
 * Entry point for the Tic Tac Toe frontend.
 * Mounts the React app into the root DOM node.
 */
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
