import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import { useAuth } from "../../../context/AuthContext";
import Table from "./Table";
import axios from "axios";
// import mentorList from "../../../data/mentorList.json"; 
// import menteeList from "../../../data/menteeList.json";

const MentorDashboard = () => {
  const { userDetails } = useAuth();
  const [mentorData, setMentorData] = useState(null);
  const [assignedMentees, setAssignedMentees] = useState([]);
  const schema = {
  "id": "",
  "name": "",
  "email": "",
  }
  const branchOptions = {
    "B-CSB": "CSB",
    "B-CSSS": "CSSS",
    "B-CSD": "CSD",
    "B-CSE": "CSE",
    "B-CSAI": "CSAI",
    "B-CSAM": "CSAM",
    "B-ECE": "ECE",
    "B-EVE": "EVE",
    "M-CSE": "CSE",
    "M-ECE": "ECE",
    "M-CB": "CB",
  };
  const yearOptions = {
    B3: "3",
    B4: "4",
    M2: "2",
  };
  const fetchAttributeId = async (id) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/getMentorById/",
        JSON.stringify({ id: id })
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



   useEffect(() => {
     const fetchData = async () => {
       try {
         // Find the admin with the matching email
        //  const matchingMentor = mentorList.find(
        //    (mentor) => mentor.email === userDetails.email
        //  );

        const userData = await fetchAttributeId(userDetails.id);
        // console.log(userData);

         if (userData) {
           // Set the matching admin's data to the state
           setMentorData(userData);

           const menteeDetails = userData.menteesToMentors;
            //  .map((menteeId) =>
            //    menteeList.find((mentee) => mentee.id === menteeId)
            //  )
            //  .filter((mentee) => mentee); // Filter out null mentees
            // console.log(menteeDetails);

           if (menteeDetails.length > 0) {
             // Check if there are mentees in the array
             // Set the extracted mentee details to the state
              // console.log(menteeDetails[0]);
             const menteeRows = menteeDetails.map((mentee) => {
              // mentee should be an array with id, name, and email
              const [id, name, email] = mentee;
              
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td>{name}</td>
                  <td>{email}</td>
                </tr>
              );
            });
            // console.log(menteeRows)

            setAssignedMentees(menteeRows)

           }
          //  console.log(assignedMentees)
         } else {
           console.error("Mentor not found for email:", userDetails.email);
         }
       } catch (error) {
         console.error("Error fetching mentor data:", error);
       }
     };

     fetchData();
   }, [userDetails.email,userDetails.id]);


  return (
    <div>
      <Navbar className="fixed-top" />
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-7" style={{ width: "100%" }}>
              <div className="card">
                {mentorData ? (
                  <div className="d-flex flex-row">
                    <div
                      className="rounded-top text-white d-flex flex-column align-items-center"
                      style={{
                        backgroundColor: "#3fada8",
                        flex: 1,
                        width: "40%",
                      }}
                    >
                      <div className="mt-2 d-flex flex-column align-items-center">
                        <img
                          src={mentorData.imgSrc}
                          alt="Profile"
                          className="img-fluid img-thumbnail mt-4 mb-2"
                          style={{ width: "50%", borderRadius: "10%" }}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <h5>{mentorData.name}</h5>
                        <p>IIIT Delhi</p>
                      </div>
                    </div>

                    <div className="card mx-3 my-3" style={{ width: "60%" }}>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Roll Number</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">{mentorData.id}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Email</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {mentorData.email}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Contact</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {mentorData.contact}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Year</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {yearOptions[mentorData.year]}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Programme</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {mentorData.department.startsWith("B")
                                ? "B.Tech"
                                : "M.Tech"}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Branch</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {branchOptions[mentorData.department]}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Goodies Status</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {mentorData.goodiesStatus}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="container p-2">
                          <div className="row">
                            <div className="col">
                              <Table
                                headers={Object.keys(schema)}
                                rows={assignedMentees}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>Loading.....</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MentorDashboard;
