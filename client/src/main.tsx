import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register cache-killer service worker — clears all old caches and unregisters
// any previous service worker. Production data always comes from the server.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(() => {});
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => {
      if (!reg.active?.scriptURL.endsWith("/sw.js")) reg.unregister();
    });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
