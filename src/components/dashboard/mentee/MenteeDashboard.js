import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import { useAuth } from "../../../context/AuthContext";
// import menteeList from "../../../data/menteeList.json";

const MenteeDashboard = () => {
  const { userDetails } = useAuth();
  const [menteeData, setMenteeData] = useState(null);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Find the admin with the matching email
        // const matchingMentee = menteeList.find(
        //   (mentee) => mentee.email === "vishesh20550@iiitd.ac.in"
        // );
        setMenteeData(userDetails)
        // if (matchingMentee) {
        //   // Set the matching admin's data to the state
        //   setMenteeData(matchingMentee);
        // } else {
        //   console.error("Mentee not found for email: vishesh20550@iiitd.ac.in");
        // }
      } catch (error) {
        console.error("Error fetching mentee data:", error);
      }
    };

    fetchData();
  });

  return (
    <div>
      <Navbar className="fixed-top" />
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-7" style={{ width: "100%" }}>
              <div className="card">
                {menteeData ? (
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
                          src={menteeData.imgSrc}
                          alt="Profile"
                          className="img-fluid img-thumbnail mt-4 mb-2"
                          style={{ width: "50%", borderRadius: "10%" }}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <h5>{menteeData.name}</h5>
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
                            <p className="text-muted mb-0">{menteeData.id}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Email</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {menteeData.email}
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
                              {menteeData.department.startsWith("B")
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
                              {branchOptions[menteeData.department]}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Mentor Image</p>
                          </div>
                          <div className="col-sm-9">
                            {menteeData.mentorId !== 'NULL' ? (
                              <img
                                src={menteeData.mentorImage}
                                alt="Mentor Profile"
                                className="img-fluid img-thumbnail mt-2"
                                style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "10%" }}
                              />
                            ) : (
                              <p>Mentor Not Assigned</p>
                            )}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Mentor Roll No</p>
                          </div>
                          <div className="col-sm-9">
                            {menteeData.mentorId !== 'NULL' ? (
                              <p className="text-muted mb-0">
                                {menteeData.mentorName}
                              </p>
                            ) : (
                              <p>Mentor Not Assigned</p>
                            )}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Mentor Email</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                            {menteeData.mentorId !== 'NULL' ? (
                              <p className="text-muted mb-0">
                                {menteeData.mentorEmail}
                              </p>
                            ) : (
                              <p>Mentor Not Assigned</p>
                            )}
                            </p>
                          </div>
                          <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Mentor Contact</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                            {menteeData.mentorId !== 'NULL' ? (
                              <p className="text-muted mb-0">
                                {menteeData.mentorContact}
                              </p>
                            ) : (
                              <p>Mentor Not Assigned</p>
                            )}
                            </p>
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

export default MenteeDashboard;
