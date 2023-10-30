import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import { useAuth } from "../../../context/AuthContext";
import Table from "./Table";

const MentorDashboard = () => {
  const { userDetails } = useAuth();
  const [mentorData, setMentorData] = useState(null);
  const schema = {
  "id": "",
  "name": "",
}

  useEffect(() => {
    // For now, assume dummy data
    const dummyData = {
      name: "Vishesh Jain",
      email: userDetails.email,
      department: "Computational Biology",
      reimbursedAmount: "10000",
      mentees: [{
  "id": "1",
  "name": "Ghost in The Wires",
},
{
  "id": "2",
  "name": "Console Wars",
},
{
  "id": "3",
  "name": "The Phoenix Project",
}],
      imgSrc:
        "https://cdn.pixabay.com/photo/2023/05/27/08/04/ai-generated-8021008_1280.jpg",
    };
    setMentorData(dummyData);
  }, [userDetails.email]);

  return (
    <div>
      <Navbar role={userDetails.role} />
      <section className="h-100 gradient-custom-2">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-9 col-xl-7">
              <div className="card">
                {mentorData ? (
                  <div>
                    <div
                      className="rounded-top text-white d-flex flex-row"
                      style={{ backgroundColor: "#3fada8" }}
                    >
                      <div className="ms-4 mt-5 d-flex flex-column">
                        <img
                          src={mentorData.imgSrc}
                          alt="Profile"
                          className="img-fluid img-thumbnail mt-4 mb-2"
                          style={{ width: "150px", borderRadius: "10%" }}
                        />
                      </div>
                      <div className="ms-3" style={{ marginTop: "130px" }}>
                        <h5>{mentorData.name}</h5>
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
                              {mentorData.email}
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
                              {mentorData.department}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-sm-3">
                            <p className="mb-0">Reimbursed Amount</p>
                          </div>
                          <div className="col-sm-9">
                            <p className="text-muted mb-0">
                              {mentorData.reimbursedAmount}
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="container p-2">
                          <div className="row">
                            <div className="col">
                              <Table
                                headers={Object.keys(schema)}
                                rows={mentorData.mentees}
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
