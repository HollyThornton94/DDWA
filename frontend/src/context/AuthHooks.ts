import { useContext } from "react"; // Import useContext hook from React
import { AuthContext } from "./AuthContext"; // Import AuthContext

// Custom hook to access the AuthContext
export const useUserContext = () => useContext(AuthContext);
