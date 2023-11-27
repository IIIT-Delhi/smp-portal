import React from "react";
import AuthButton from "../components/auth/AuthButton";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Import the AuthContext
import bgImage from "../images/iiitdrndblock2.jpeg";
// import { useAuth } from "../context/AuthContext";
// import Login from "../components/Login";

const LoginPage = () => {
  // const navigate = useNavigate();
  // const {setvaliduser , setisNewMentor} = useAuth();
  // const { login } = useAuth(); // Get the login function from the AuthContext

  // const handleLogin = (userDetails) => {
  //   // Assuming userDetails include role and email
  //   // Redirect to the role-specific dashboard with the updated userDetails
  //   navigate(`/dashboard/${userDetails}/profile`);
  // };
  // setvaliduser(null)
  // setisNewMentor(false)

  return (
    <div
      className="container-fluid d-flex flex-row justify-content-center align-items-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        color: "white", 

        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh", // Set the height to 100% of the viewport height
        width: "100%", 
        boxSizing : "border-box",
        textAlign : "center"
        
      }}
    >
      <div
        className="text-center"
        style={{
          backgroundColor: "rgba(47,191,177, 0.85)",
          borderRadius: "25px",
          padding : '25px',
          width : '110vh',
          marginRight : '5%'
        }}
      >
        <h1 style={{color : "#472b50"}}>Student Mentorship Portal</h1>
        <p className="mt-5" style={{fontSize : '1.1em'}}>
          <b>
          Student Mentorship Program (SMP) is a program within the IIIT Delhi student community, 
          with the primary objective of enabling constructive and positive interaction, guidance 
          and mentorship of junior students by senior students. The Student Mentor is generally 
          more experienced than the Mentee and makes use of that experience in a facilitative way 
          to support the first year students for their development. In a nutshell, a Student Mentor’s
          role may be perceived to be facilitative, supportive and developmental for the student 
          community in general. The mentoring relationship provides a developmental opportunity not
          just to the Mentees but to the Mentors as well.
          </b>
        </p>
        
      </div>
      

      <div
        className="text-center"
        style={{
          backgroundColor: "rgba(47,191,177, 0.85)",
          borderRadius: "25px",
          padding: "35px",
          width : '55vh'
        }}
      >
        <h2>Login</h2>
        <AuthButton/>
      </div>
    </div>
  );
};

export default LoginPage;
