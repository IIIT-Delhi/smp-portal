import React from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";

import Navbar from "../components/dashboard/common/Navbar";

// Role-specific dashboard components
import MenteeDashboard from "../components/dashboard/mentee/MenteeDashboard";
import MentorDashboard from "../components/dashboard/mentor/MentorDashboard";
import AdminDashboard from "../components/dashboard/admin/AdminDashboard";

const DashboardPage = () => {
  const location = useLocation();
  const userDetails = location.state;
  const navigate = useNavigate();

  // Check the user's role from the user details (passed from login)
  const role  = userDetails.role;
  return (
    <div>
      <Navbar role={role} />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            {/* Display the role-specific dashboard based on the URL */}
            {role === 'mentee' && <MenteeDashboard />}
            {role === 'mentor' && <MentorDashboard />}
            {role === 'admin' && <AdminDashboard />}
          </div>
        </div>
      </div>
      {/* Use Outlet to render child routes */}
      <Outlet />
    </div>
  );
};

export default DashboardPage;
