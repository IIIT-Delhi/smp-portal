import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import { useAuth } from "../../../context/AuthContext";

const MenteeDashboard = () => {
  const { userDetails } = useAuth();
  const [menteeData, setMenteeData] = useState(null);

  useEffect(() => {
    // Fetch admin data from PSQL API (or use the dummy data for now)
    // Replace this section with actual API call
    // const fetchData = async () => {
    //   try {
    //     const response = await fetch('your-api-endpoint/admin');
    //     const data = await response.json();
    //     setAdminData(data);
    //   } catch (error) {
    //     console.error('Error fetching admin data:', error);
    //   }
    // };
    // fetchData();

    // For now, assume dummy data from adminData.json
    const dummyData = {
      name: "Prashant",
      email: userDetails.email, // Use the email from AuthContext
      department: "Computaiton Biology",
      mentorName: "Vishesh Jain",
      mentorEmail: "vishesh20550@iiitd.ac.in",
      imgSrc:
        "https://cdn.pixabay.com/photo/2023/05/27/08/04/ai-generated-8021008_1280.jpg",
    };
    setMenteeData(dummyData);
  }, [userDetails.email]);

  return (
    <div>
      <Navbar role={userDetails.role} />
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-7">
              <div className="card">
                {menteeData ? (
                  <div>
                    <div
                      className="rounded-top text-white d-flex flex-row"
                      style={{ backgroundColor: "#3fada8" }}
                    >
                      <div className="ms-4 mt-5 d-flex flex-column">
                        <img
                          src={menteeData.imgSrc}
                          alt="Profile"
                          className="img-fluid img-thumbnail mt-4 mb-2"
                          style={{ width: "150px", borderRadius: "10%" }}
                        />
                      </div>
                      <div className="ms-3" style={{ marginTop: "130px" }}>
                        <h5>{menteeData.name}</h5>
                        <p>IIIT Delhi</p>
                      </div>
                    </div>
                    <div className="card mx-3 my-3">
                      <div className="card-body">
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
                            <p className="mb-0">Department</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {menteeData.department}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Mentor</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {menteeData.mentorName}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Mentor Email</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {menteeData.mentorEmail}
                            </p>
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

  // const { userDetails } = useAuth();
  // return (
  //   <div>
  //     <Navbar userDetails={userDetails} />
  //     <div className="container mt-4">
  //       <div className="row">
  //         <div className="col-12">
  //           <div>
  //             {/* Include profile information specific to Mentees */}
  //             <h4>Mentee Dashboard</h4>
  //             <p>
  //               <strong>Role:</strong> {userDetails.role}
  //             </p>
  //             <p>
  //               <strong>Email:</strong> {userDetails.email}
  //             </p>
  //             {/* Other Mentee-specific content */}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default MenteeDashboard;
