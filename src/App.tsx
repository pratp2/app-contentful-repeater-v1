import { FieldAppSDK, locations } from "@contentful/app-sdk";
import { useSDK } from "@contentful/react-apps-toolkit";
import { useMemo } from "react";
import Field from "./locations/Field";

/**
 * Mapping of supported Contentful locations to their React components.
 *
 * Keys are location identifiers from the Contentful SDK and values are the
 * components that should be mounted when the app is rendered in that location.
 */
const ComponentLocationSettings: Record<
  string,
  React.ComponentType<{ sdk: FieldAppSDK }>
> = {
  [locations.LOCATION_ENTRY_FIELD]: Field,
};

/**
 * App root component.
 *
 * Resolves and renders the component associated with the current Contentful
 * location. If no component is registered for the current location, renders
 * null.
 *
 * @returns {JSX.Element | null} The resolved component for the current location or `null` if no match.
 */
const App = () => {
  const sdk = useSDK();

  const Component = useMemo(() => {
    for (const [location, component] of Object.entries(
      ComponentLocationSettings,
    )) {
      if (sdk.location.is(location)) {
        return component;
      }
    }
  }, [sdk.location]);

  return Component ? <Component sdk={sdk as FieldAppSDK} /> : null;
};

export default App;
