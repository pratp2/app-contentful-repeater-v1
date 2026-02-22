import { createRoot } from "react-dom/client";

import { GlobalStyles } from "@contentful/f36-components";
import { SDKProvider } from "@contentful/react-apps-toolkit";

import App from "./App";
import LocalhostWarning from "./components/LocalhostWarning";

/**
 * Application entrypoint.
 *
 * Renders a development warning when the app is loaded directly in the browser
 * (outside the Contentful web app). In production or when embedded inside the
 * Contentful UI, mounts the application wrapped with the SDK provider.
 */

const container = document.getElementById("root")!;
const root = createRoot(container);

if (import.meta.env.DEV && window.self === window.top) {
  // You can remove this if block before deploying your app
  root.render(<LocalhostWarning />);
} else {
  root.render(
    <SDKProvider>
      <GlobalStyles />
      <App />
    </SDKProvider>,
  );
}
