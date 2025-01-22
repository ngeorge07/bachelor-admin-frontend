"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
// import { cookies } from "next/headers";

type User = {
  userId: string;
  email: string;
  fullName: string;
  roles: string[];
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  const login = async (email: string, password: string) => {
    // const cookieStore = await cookies();

    try {
      // Send login request
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email,
          password,
        },
      );

      const token = data.access_token;

      if (token) {
        // Save the token in a cookie
        // cookieStore.set("authToken", token, { secure: true });

        // Fetch user profile using the token
        const { data: user } = await axios.get(
          "http://localhost:3000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        console.log(user);

        // Set the user in context (or any other state management)
        setUser(user);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    // Remove the token from cookies
    // (await cookies()).delete("name");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
