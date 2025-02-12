import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "../types";

// Define the initial user object with default values
export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  email: "",
  isAdmin: false,
  frequentCustomer: false,
};

// Define the initial state for the authentication context
const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

// Define the context type with properties and functions related to authentication
export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

// Create AuthContext with the initial state
export const AuthContext = createContext<IContextType>(INITIAL_STATE);

// Custom hook to access the AuthContext
export const useUserContext = () => useContext(AuthContext);

// Define the AuthProvider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State to hold user data, initialized with INITIAL_USER
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Function to check if the user is authenticated
  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        return false;
      }

      const currentAccount = await fetch("http://localhost:8080/currentUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((res) => res.json());

      if (currentAccount) {
        setUser({
          id: currentAccount.id,
          name: currentAccount.name,
          email: currentAccount.email,
          isAdmin: currentAccount.isAdmin,
          frequentCustomer: false,
        });
        setIsAuthenticated(true);
        return true;
      }

      setIsAuthenticated(false);
      return false;
    } catch (error) {
      console.error(error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect to handle redirection and check user authentication on mount
  useEffect(() => {
    checkAuthUser(); // Check if the user is authenticated
  }, []);

  // Context value to be provided to consumers
  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
  };

  // Provide the context value to child components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
