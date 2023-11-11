import React from "react";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ path, children, allowedRole, requiredStatus }) => {
  const { userDetails } = useAuth();

  if (userDetails.role === allowedRole) {
    if (
      path !== "/registration" &&
      allowedRole === "mentor" &&
      userDetails.status !== requiredStatus
    ) {
      return (
        <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
          <div className="card p-4 mt-5">
            Page not accessible. Please check your status on "/registration"
          </div>
        </div>
      );
    }
    return <>{children}</>;
  } else {
    return (
      <div className="container d-flex justify-content-center justify-text-center align-items-center h-100-center">
        <div className="card p-4 mt-5">Permission Denied</div>
      </div>
    );
  }
};

export default PrivateRoute;
