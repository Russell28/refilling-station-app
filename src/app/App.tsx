import { useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { useEffect, useState } from "react";
import { getMe, refreshToken } from "../features/auth/api/authApi";
import { clearAuth, saveAuth, saveUserDetails } from "../features/auth/utils/authStorage";

export default function App() {
  const [authInitializing, setAuthInitializing] = useState(true); // Track whether we're still bootstrapping auth on app load
  const element = useRoutes(routes);

  useEffect(() => {
    async function bootstrapAuth() {
      try {
        const authResponse = await refreshToken(); // Attempt to refresh token on app load
        if (authResponse.accessToken) {
          // If we get a new access token, save it to memory
          saveAuth(authResponse.accessToken);
          
          const authUserResponse = await getMe();
          saveUserDetails(authUserResponse.username, authUserResponse.role);
        }
      } catch (error) {
        clearAuth(); // Clear any existing auth info if refresh fails (e.g. token expired)
        console.error("Error during auth bootstrap:", error);
      } finally {
        setAuthInitializing(false); // done bootstrapping
      }
    }

    bootstrapAuth();
  }, []);

  if (authInitializing) {
    return <div>Loading...</div>; // or a spinner
  }

  return element;
}