import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
// import DashboardPage from "./pages/DashboardPage";
import MenteeDashboard from "./components/dashboard/mentee/MenteeDashboard";
import MentorDashboard from "./components/dashboard/mentor/MentorDashboard";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" Component={LoginPage} />
            {/* <Route path="/dashboard/*" Component={DashboardPage} /> */}
            <Route path="/dashboard/mentor/profile" Component={MentorDashboard} />
            <Route path="/dashboard/mentee/profile" Component={MenteeDashboard} />
            <Route path="/dashboard/admin/profile" Component={AdminDashboard} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
