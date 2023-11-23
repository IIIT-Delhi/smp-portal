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
import RegistrationForm from "./components/dashboard/mentor/registration/RegistrationForm";
import PrivateRoute from "./routes/PrivateRoute";
import FormResponses from "./components/dashboard/admin/forms/FormResponses";
// import MenteeProfile from "./components/dashboard/admin/mentees/MenteeProfile";
// import MentorProfile from "./components/dashboard/admin/mentors/MentorProfile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/login" Component={LoginPage} />
            <Route path="/google-login" element={<Login />} />
            {/* <Route path="/dashboard/*" element={DashboardPage} /> */}
            {/*------------------- Mentor BELOW--------------------------------*/}
            <Route
              path="/dashboard/mentor/profile"
              element={
                <PrivateRoute
                  path="/dashboard/mentor/profile"
                  allowedRole={"mentor"}
                  requiredStatus={5}
                >
                  <MentorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/mentor/meetings"
              element={
                <PrivateRoute
                  path="/dashboard/mentor/meetings"
                  allowedRole={"mentor"}
                  requiredStatus={5}
                >
                  <MentorMeetingList />
                </PrivateRoute>
              }
            />
            <Route
              path="/registration"
              element={
                <PrivateRoute path="/registration" allowedRole={"mentor"}>
                  <RegistrationForm />
                </PrivateRoute>
              }
            />
            {/*------------------- Mentee BELOW--------------------------------*/}
            <Route
              path="/dashboard/mentee/profile"
              element={
                <PrivateRoute
                  path="/dashboard/mentee/profile"
                  allowedRole={"mentee"}
                >
                  <MenteeDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/mentee/meetings"
              element={
                <PrivateRoute
                  path="/dashboard/mentee/meetings"
                  allowedRole={"mentee"}
                >
                  <MenteeMeetingList />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/mentee/form"
              element={
                <PrivateRoute
                  path="/dashboard/mentee/form"
                  allowedRole={"mentee"}
                >
                  <MenteeForm />
                </PrivateRoute>
              }
            />
            {/*------------------- ADMIN BELOW--------------------------------*/}
            <Route
              path="/dashboard/admin/profile"
              element={
                <PrivateRoute
                  path="/dashboard/admin/profile"
                  allowedRole={"admin"}
                >
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/admin/meetings"
              element={
                <PrivateRoute
                  path="/dashboard/admin/meetings"
                  allowedRole={"admin"}
                >
                  <AdminMeetingList />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/admin/mentors"
              element={
                <PrivateRoute
                  path="/dashboard/admin/mentors"
                  allowedRole={"admin"}
                >
                  <MentorsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/admin/mentees"
              element={
                <PrivateRoute
                  path="/dashboard/admin/mentees"
                  allowedRole={"admin"}
                >
                  <MenteesList />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/admin/form"
              element={
                <PrivateRoute
                  path="/dashboard/admin/form"
                  allowedRole={"admin"}
                >
                  <FormList />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard/admin/form-responses"
              element={
                <PrivateRoute
                  path="/dashboard/admin/form-responses"
                  allowedRole={"admin"}
                >
                  <FormResponses />
                </PrivateRoute>
              }
            />
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
