import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import axios from 'axios'; // Import Axios
// import { useSyncExternalStore } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(null); // Store user information
  const [userDetails, setUserDetails] = useState(null); // Store user details

  const fetchAttributeId = async (email, role) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/getIdByEmail/",
        { params: { email: email, role: role } }
      );
  
      let userData;
  
      if (typeof response.data === "string") {
        // If response.data is a string, parse it as JSON
        const dataObject = JSON.parse(response.data);
        userData = dataObject;
      } else if (typeof response.data === "object") {
        // If response.data is already an object, access id directly
        userData = response.data;
      }
  
      if (userData) {
        // console.log("Attribute ID:", id);
        // Update the userDetails with the retrieved 'id'
        return userData;
      } else {
        console.error("User ID not found in response data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching attribute:", error);
      return null;
    }
  };

  const login = async (user) => {
    const userData = await fetchAttributeId(user.email, user.role);
  
    const updatedUserData = { ...userData, role: user.role };

    setUserDetails(updatedUserData);
    // Additional logic for different scenarios if needed
  };


  const logout = () => {
    // Perform logout logic, e.g., sign out from Google Auth
    // Clear the user information after logout
    // setUser(null);
    // Clear user details on logout
    setUserDetails(null);
  };

  useEffect(() => {
    // Check if the user is already authenticated (e.g., from a previous session)
    // You can perform this check here and set the user state accordingly.
    // For simplicity, this example doesn't include this check.
  }, []);

  const value = {
    userDetails,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
