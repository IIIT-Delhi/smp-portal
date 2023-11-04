import Navbar from "../common/Navbar";
import { useAuth } from "../../../context/AuthContext";
import React, { useState, useEffect } from "react";
import adminList from "../../../data/adminList.json";

const AdminDashboard = () => {
  const { userDetails } = useAuth();
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Find the admin with the matching email
        const matchingAdmin = adminList.find((admin) => admin.email === userDetails.email);

        if (matchingAdmin) {
          // Set the matching admin's data to the state
          setAdminData(matchingAdmin);
        } else {
          console.error("Admin not found for email: ", userDetails.email);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchData();
  }, [userDetails.email]);

  return (
    <div>
      <Navbar className="fixed-top" />
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-7" style={{ width: "100%" }}>
              <div className="card">
                {adminData ? (
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
                          src={adminData.imgSrc}
                          alt="Profile"
                          className="img-fluid img-thumbnail mt-4 mb-2"
                          style={{ width: "150px", borderRadius: "10%" }}
                        />
                      </div>
                      <div className="mt-2 text-center">
                        <h5>{adminData.name}</h5>
                        <p>IIIT Delhi</p>
                      </div>
                    </div>
                    <div className="card mx-3 my-3" style={{ width: "60%" }}>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">ID</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">{adminData.id}</p>
                          </div>
                        </div>
                        <hr />
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
