import React, { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios'; // Import Axios

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  // const [user, setUser] = useState(null); // Store user information
  const [userDetails, setUserDetails] = useState(null); // Store user details
  const [validuser, setvaliduser] = useState(null);
  const [isNewMentor, setisNewMentor] = useState(false);
  const fetchAttributeId = async (email, role) => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/getIdByEmail/",
        { params: { email: email, role: role } }
      );
  
      let id;
  
      if (typeof response.data === "string") {
        // If response.data is a string, parse it as JSON
        const dataObject = JSON.parse(response.data);
        id = dataObject.id;
      } else if (typeof response.data === "object") {
        // If response.data is already an object, access id directly
        id = response.data.id;
      }
  
      if (id) {
        // console.log("Attribute ID:", id);
        // Update the userDetails with the retrieved 'id'
        return id;
      } else {
        console.error("User ID not found in response data");
        return null;
      }
    } catch (error) {
      console.error("Error fetching attribute:", error);
      return null;
    }
  };
  



  const login = (user) => {
    const email = user.email;
    // const id = `20${email.split('@')[0].slice(-5)}`; // Extract and format the id
    // console.log(id)
    

    
    if (user.role === 'admin') {
      const adminList = require('../data/adminList.json'); // Assuming the path to the JSON file is correct
      const isAdmin = adminList.some((admin) => admin.email === email);

      if (isAdmin) {
        setUserDetails({ role: 'admin', email: user.email });
        setvaliduser(true)
        // Additional logic for admin login if needed
      } else {
        setvaliduser(false)
        console.error('User is not authorized as an admin');
      }
    } else if (user.role === 'mentor') {
      const mentorList = require('../data/mentorList.json');
      const isMentor = mentorList.some((mentor) => mentor.email === email);


      if (isMentor) {
        // check for the status i.e.
        // If Rejected or Waiting -> simply show the equivalent message and then redirect to the login page
        // else Accepted then set the user details and vaild = true
        setvaliduser(true)
        setUserDetails({ role: 'mentor', email: user.email });
        // Additional logic for mentor login if needed
      } else {

        // make the user fill out the entry form. And check for third or fourth year


        // setvaliduser(false)
        setisNewMentor(true)
        setUserDetails({ role: "newUser", email: user.email });
        console.error('New User for Mentor');
      }
    } else if (user.role === 'mentee') {
      const menteeList = require('../data/menteeList.json');
      const isMentee = menteeList.some((mentee) => mentee.email === email);

      if (isMentee) {
        setvaliduser(true)
        setUserDetails({ role: 'mentee', email: user.email });
        // Additional logic for mentee login if needed
      } else {
        setvaliduser(false)
        console.error('User is not authorized as a mentee');
      }
    } else {
      console.error('Invalid user role');
    }
    fetchAttributeId(email,user.role).then((id) => {
      if (id) {
        // You can use the 'id' as needed
        console.log("Attribute ID:", id);
        setUserDetails((prevUserDetails) => ({
          ...prevUserDetails,
          id: id,
        }));
      }
    });
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
    validuser,
    setvaliduser,
    isNewMentor,
    setisNewMentor
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
