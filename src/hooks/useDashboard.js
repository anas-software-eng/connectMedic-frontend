import { useOutletContext } from "react-router-dom";

// Nested dashboard pages read the resolved role config from the layout's outlet
// context instead of recomputing it: const { config, authUser } = useDashboard();
export const useDashboard = () => useOutletContext() ?? {};
