import { createContext, useContext } from "react"; // Import necessary functions from React
import { IUser } from "../types"; // Import IUser type for user data

// Define the initial user object with default values
export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  email: "",
  isAdmin: false,
  frequentCustomer: false,
};

// Define the initial state for the authentication context
export const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {}, // Placeholder function for setting user
  setIsAuthenticated: () => {}, // Placeholder function for setting authentication status
  checkAuthUser: async () => false as boolean, // Placeholder async function for checking authentication
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
