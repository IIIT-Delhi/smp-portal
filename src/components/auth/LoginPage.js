import React from "react";
import AuthButton from "./AuthButton";
import bgImage from "../../images/iiitdrndblock2.jpeg";

const LoginPage = () => {

  return (
    <div
      className="container-fluid d-flex flex justify-content-center align-items-center"
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
          backgroundColor: "rgba(47,191,177, 0.90)",
          borderRadius: "20px",
          padding : '25px',
          width : '110vh',
          marginRight : '5%'
        }}
      >
        <h1 style={{color : "#472b50", fontSize : '2.5vw'}}> <b>Student Mentorship Portal</b></h1>
        <p className="mt-3" style={{fontSize : '1.4vw'}}>
          Student Mentorship Program (SMP) is a program within the IIIT Delhi student community, 
          with the primary objective of enabling constructive and positive interaction, guidance 
          and mentorship of junior students by senior students. The Student Mentor is generally 
          more experienced than the Mentee and makes use of that experience in a facilitative way 
          to support the first year students for their development. In a nutshell, a Student Mentor’s
          role may be perceived to be facilitative, supportive and developmental for the student 
          community in general. The mentoring relationship provides a developmental opportunity not
          just to the Mentees but to the Mentors as well.
        </p>
        
      </div>
      

      <div
        className="text-center"
        style={{
          backgroundColor: "rgba(47,191,177, 0.85)",
          borderRadius: "20px",
          padding: "35px",
          width : '55vh',
        }}
      >
        <h2 style={{fontSize : '2.5vw'}}>Login</h2>
        <AuthButton/>
      </div>
    </div>
  );
};

export default LoginPage;
