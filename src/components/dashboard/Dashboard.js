import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import { useAuth } from "../../context/AuthContext";
import Table from "../Table";
import axios from "axios";
import deparmentOptions from "../../data/departmentOptions.json";
import yearOptions from "../../data/yearOptions.json";

const Dashboard = () => {
  const { userDetails } = useAuth();
  const [userData, setUserData] = useState(null);
  const [assignedMentees, setAssignedMentees] = useState([]);
  const schema = {
    id: "",
    name: "",
    email: "",
    contact: "",
    department: "",
  };

  const fetchAttributeId = async (id) => {
    try {
      const response = await axios.post(
        "https://smpportal.iiitd.edu.in/api/getMentorById/",
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
    if (userDetails.role === "mentor") {
      const fetchData = async () => {
        try {
          const userDataTemp = await fetchAttributeId(userDetails.id);

          if (userDataTemp) {
            setUserData(userDataTemp);

            const menteeDetails = userDataTemp.menteesToMentors;

            if (menteeDetails.length > 0) {
              const menteeRows = menteeDetails.map((mentee) => {
                const [id, name, email, contact, department] = mentee;

                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{name}</td>
                    <td>{email}</td>
                    <td>{contact}</td>
                    <td>{deparmentOptions[department]}</td>
                  </tr>
                );
              });

              setAssignedMentees(menteeRows);
            }
          } else {
            console.error("Mentor not found for email:", userDetails.email);
          }
        } catch (error) {
          console.error("Error fetching mentor data:", error);
        }
      };

      fetchData();
    } else if (userDetails.role === "admin") {
      setUserData(userDetails);
    } else {
      setUserData(userDetails);
    }
  }, [userDetails.email, userDetails.id, userDetails.role]);

  return (
    <div>
      <Navbar className="fixed-top" />
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-7" style={{ width: "100%" }}>
              <div className="card">
                {userData ? (
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
                          src={userData.imgSrc}
                          alt="Profile"
                          className="img-fluid img-thumbnail mt-4 mb-2"
                          style={{ width: "50%", borderRadius: "10%" }}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <h5>{userData.name}</h5>
                        <p>IIIT Delhi</p>
                      </div>
                    </div>

                    <div className="card mx-3 my-3" style={{ width: "60%" }}>
                      <div className="card-body">
                        {userDetails.role !== "admin" && (
                          <div>
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Roll Number</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0">{userData.id}</p>
                              </div>
                            </div>
                            <hr />
                          </div>
                        )}
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Email</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">{userData.email}</p>
                          </div>
                        </div>
                        <hr />
                        {userDetails.role === "admin" && (
                          <div className="row">
                            <div className="col-sm-3">
                              <p className="mb-0">Phone</p>
                            </div>
                            <div className="col-sm-9">
                              <p className="text-muted mb-0">
                                {userData.phone}
                              </p>
                            </div>
                          </div>
                        )}
                        {(userDetails.role === "mentor" ||
                          userDetails.role === "mentee") && (
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Contact</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0">
                                  {userData.contact}
                                </p>
                              </div>
                            </div>
                          )}
                        <hr />
                        {userDetails.role === "mentor" && (
                          <div>
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Year</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0">
                                  {userData.year[1]}
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
                                  {userData.department.startsWith("B")
                                    ? "B.Tech"
                                    : "M.Tech"}
                                </p>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Department</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0">
                                  {deparmentOptions[userData.department].split(" ")[0]}
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
                        )}
                        {userDetails.role === "mentee" && (
                          <div>
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Programme</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0">
                                  {userData.department.startsWith("B")
                                    ? "B.Tech"
                                    : "M.Tech"}
                                </p>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Department</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0">
                                  {deparmentOptions[userData.department].split(" ")[0]}
                                </p>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Mentor Image</p>
                              </div>
                              <div className="col-sm-9">
                                {userData.mentorId !== "NULL" ? (
                                  <img
                                    src={userData.mentorImage}
                                    alt="Mentor Profile"
                                    className="img-fluid img-thumbnail mt-2"
                                    style={{
                                      maxWidth: "100px",
                                      maxHeight: "100px",
                                      borderRadius: "10%",
                                    }}
                                  />
                                ) : (
                                  <p>Mentor Not Assigned</p>
                                )}
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Mentor Name</p>
                              </div>
                              <div className="col-sm-9">
                                {userData.mentorId !== "NULL" ? (
                                  <p className="text-muted mb-0">
                                    {userData.mentorName}
                                  </p>
                                ) : (
                                  <p>Mentor Not Assigned</p>
                                )}
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Mentor Roll no</p>
                              </div>
                              <div className="col-sm-9">
                                {userData.mentorId !== "NULL" ? (
                                  <p className="text-muted mb-0">
                                    {userData.mentorId}
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
                                  {userData.mentorId !== "NULL" ? (
                                    <p className="text-muted mb-0">
                                      {userData.mentorEmail}
                                    </p>
                                  ) : (
                                    <p>Mentor Not Assigned</p>
                                  )}
                                </p>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Mentor Department</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0">
                                  {userData.mentorId !== "NULL" ? (
                                    <p className="text-muted mb-0">
                                      {deparmentOptions[userData.mentorDepartment]}
                                    </p>
                                  ) : (
                                    <p>Mentor Not Assigned</p>
                                  )}
                                </p>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Mentor Contact</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0">
                                  {userData.mentorId !== "NULL" ? (
                                    <p className="text-muted mb-0">
                                      {userData.mentorContact}
                                    </p>
                                  ) : (
                                    <p>Mentor Not Assigned</p>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {userDetails.role === "admin" && (
                          <div>
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Department</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0">
                                  {userData.department}
                                </p>
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3">
                                <p className="mb-0">Address</p>
                              </div>
                              <div className="col-sm-9">
                                <p className="text-muted mb-0">
                                  {userData.address}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
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

export default Dashboard;
