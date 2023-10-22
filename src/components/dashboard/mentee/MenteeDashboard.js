import React from "react";
import Navbar from "../common/Navbar";
import { useAuth } from "../../../context/AuthContext";

const MenteeDashboard = () => {
  const { userDetails } = useAuth();
  return (
    <div>
      <Navbar userDetails={userDetails} />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div>
              {/* Include profile information specific to Mentees */}
              <h4>Mentee Dashboard</h4>
              <p>
                <strong>Role:</strong> {userDetails.role}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              {/* Other Mentee-specific content */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenteeDashboard;
