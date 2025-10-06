import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

console.log("GitGudMusic starting...", {
  env: import.meta.env.MODE,
  base: import.meta.env.BASE_URL,
  dev: import.meta.env.DEV,
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
} else {
  console.log("Root element found, rendering app...");
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
