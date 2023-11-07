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
      const response = await axios.post(
        "http://127.0.0.1:8000/getIdByEmail",
        { email: email, role: role }
      );
      const id = response.data.id;

      // Update the userDetails with the retrieved 'id'
      setUserDetails((prevUserDetails) => ({
        ...prevUserDetails,
        id: id,
      }));

      return id;
    } catch (error) {
      console.error("Error fetching attribute:", error);
      return null;
    }
  };

  useEffect(() => {
      // Fetch the 'id' attribute for the user's email
      if (userDetails && userDetails.email && userDetails.role) {
        fetchAttributeId(userDetails.email,userDetails.role).then((id) => {
          if (id) {
            // You can use the 'id' as needed
            console.log("Attribute ID:", id);
          }
        });
      }
    }, [userDetails]);


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
