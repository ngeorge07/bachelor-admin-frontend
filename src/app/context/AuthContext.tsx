"use client";

import { createContext, useState } from "react";
import { useEffect } from "react";
import verifyAuth from "@/utils/verifyAuth";

type User = {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
};

type AuthContextType = {
  authState: {
    isAuthenticated: boolean;
    userData: User | null;
  };
  onSignInSuccess: () => void;
  onSignOutSuccess: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  authState: {
    isAuthenticated: false,
    userData: null,
  },
  onSignInSuccess: () => {},
  onSignOutSuccess: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userData: null,
  });
  const [loading, setLoading] = useState(true); // Track loading state
  const [authChecked, setAuthChecked] = useState(false); // Track if the authentication check has completed

  useEffect(() => {
    async function checkAuthentication() {
      const authenticationResult = await verifyAuth("profile");
      if (authenticationResult) {
        setAuthState({
          isAuthenticated: authenticationResult.isAuthenticated,
          userData: authenticationResult.userData,
        });
      }
      setLoading(false); // Stop loading after auth check
      setAuthChecked(true); // Mark authentication check as complete
    }

    checkAuthentication();
  }, [authState.isAuthenticated]);

  const handleSignInSuccess = () => {
    setAuthState({
      ...authState,
      isAuthenticated: true,
    });
  };

  const handleSignOutSuccess = () => {
    setAuthState({
      ...authState,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        onSignInSuccess: handleSignInSuccess,
        onSignOutSuccess: handleSignOutSuccess,
      }}
    >
      {!authChecked || loading ? (
        // Show a loading spinner while checking auth or if auth check isn't done
        <div>Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
