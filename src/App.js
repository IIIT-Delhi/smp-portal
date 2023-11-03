import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
// import DashboardPage from "./pages/DashboardPage";
import MenteeDashboard from "./components/dashboard/mentee/MenteeDashboard";
import MentorDashboard from "./components/dashboard/mentor/MentorDashboard";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import AdminMeetingList from "./components/dashboard/admin/meetings/AdminMeetingList";
import MentorMeetingList from "./components/dashboard/mentor/meetings/MentorMeetingList";
import MenteeMeetingList from "./components/dashboard/mentee/meetings/MenteeMeetingList";
import MenteesList from "./components/dashboard/admin/mentees/MenteesList";
import MentorsList from "./components/dashboard/admin/mentors/MentorsList";
import FormList from "./components/dashboard/admin/forms/FormList";
import MenteeForm from "./components/dashboard/mentee/forms/MenteeForm";
import Login from "./components/Login";
// import MenteeProfile from "./components/dashboard/admin/mentees/MenteeProfile";
// import MentorProfile from "./components/dashboard/admin/mentors/MentorProfile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" Component={LoginPage} />
            <Route path="/google-login" element={<Login/>} />
            {/* <Route path="/dashboard/*" Component={DashboardPage} /> */}
            {/*------------------- Mentor BELOW--------------------------------*/}
            <Route
              path="/dashboard/mentor/profile"
              Component={MentorDashboard}
            />
            <Route
              path="/dashboard/mentor/meetings"
              Component={MentorMeetingList}
            />
            {/*------------------- Mentee BELOW--------------------------------*/}
            <Route
              path="/dashboard/mentee/profile"
              Component={MenteeDashboard}
            />
            <Route
              path="/dashboard/mentee/meetings"
              Component={MenteeMeetingList}
            />
            <Route path="/dashboard/mentee/form" Component={MenteeForm} />
            {/*------------------- ADMIN BELOW--------------------------------*/}
            <Route path="/dashboard/admin/profile" Component={AdminDashboard} />
            <Route
              path="/dashboard/admin/meetings"
              Component={AdminMeetingList}
            />
            <Route path="/dashboard/admin/mentors" Component={MentorsList} />
            <Route path="/dashboard/admin/mentees" Component={MenteesList} />
            <Route path="/dashboard/admin/form" Component={FormList} />
            {/* <Route
              path="/dashboard/admin/mentors/:mentorId"
              component={MentorProfile}
            />
            <Route
              path="/dashboard/admin/mentors/:menteeId"
              component={MenteeProfile}
            /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
