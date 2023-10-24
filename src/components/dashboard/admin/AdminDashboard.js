import Navbar from "../common/Navbar";
import { useAuth } from "../../../context/AuthContext";
import React, { useState, useEffect } from "react";

const AdminDashboard = () => {
  const { userDetails } = useAuth();
  const [adminData, setAdminData] = useState(null);

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
      name: "Khushpinder P. Sharma",
      email: userDetails.email, // Use the email from AuthContext
      department: "Coordinator",
      mobile: "9876543210",
      phone: "0123456789",
      address: "Old Academic Block, IIIT Delhi",
      imgSrc: "https://www.iiitd.ac.in/smp/khuspinder.jpg",
    };
    setAdminData(dummyData);
  }, [userDetails.email]);

  return (
    <div>
      <Navbar role={userDetails.role} />
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-7">
              <div className="card">
                {adminData ? (
                  <div>
                    <div
                      className="rounded-top text-white d-flex flex-row"
                      style={{ backgroundColor: "#000" }}
                    >
                      <div className="ms-4 mt-5 d-flex flex-column">
                        <img
                          src={adminData.imgSrc}
                          alt="Profile"
                          className="img-fluid img-thumbnail mt-4 mb-2"
                          style={{ width: "150px", borderRadius: "10%" }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-light mb-2 mt-2"
                          data-mdb-ripple-color="light"
                          style={{ width: "150px" }}
                        >
                          Edit Profile
                        </button>
                      </div>
                      <div className="ms-3" style={{ marginTop: "130px" }}>
                        <h5>{adminData.name}</h5>
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
                            <p className="text-muted mb-0">{adminData.email}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Department</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {adminData.department}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Phone</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">{adminData.phone}</p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Mobile</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {adminData.mobile}
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
                              {adminData.address}
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
};

export default AdminDashboard;

// const AdminDashboard = () => {
//   const { userDetails } = useAuth();

//   return (
//     <div>
//       <Navbar role={userDetails.role} />
//       <div className="container mt-4">
//         <div className="row">
//           <div className="col-12">
//             <div>
//               {/* Include profile information specific to Mentees */}
//               <h4>Mentee Dashboard</h4>
//               <p>
//                 <strong>Role:</strong> {userDetails.role}
//               </p>
//               <p>
//                 <strong>Email:</strong> {userDetails.email}
//               </p>
//               {/* Other Mentee-specific content */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
