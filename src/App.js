import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./components/auth/LoginPage";
import Dashboard from "./components/dashboard/Dashboard";
import MenteesList from "./components/users/admin/menteesList/MenteesList";
import MtechMenteesList from "./components/users/admin/menteesList/MtechMenteesList";
import MentorsList from "./components/users/admin/mentorsList/MentorsList";
import FormList from "./components/users/admin/forms/FormList";
import FormManagement from "./components/users/admin/FormManagement";
import FeedbackForm from "./components/users/mentee/FeedbackForm";
import Login from "./components/auth/Login";
import RegistrationForm from "./components/users/mentor/RegistrationForm";
import PrivateRoute from "./routes/PrivateRoute";
import FormResponses from "./components/users/admin/forms/FormResponses";
import MeetingList from "./components/Meetings/MeetingList";
import MtechMentorsList from "./components/users/admin/mentorsList/MtechMentorsList";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" Component={LoginPage} />
            <Route path="/login" Component={LoginPage} />
            <Route path="/google-login" element={<Login />} />
            {/*------------------- Mentor BELOW--------------------------------*/}
            <Route
              path="/users/mentor/profile"
              element={
                <PrivateRoute
                  path="/users/mentor/profile"
                  allowedRole={"mentor"}
                  requiredStatus={5}
                >
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/mentor/Meetings"
              element={
                <PrivateRoute
                  path="/users/mentor/Meetings"
                  allowedRole={"mentor"}
                  requiredStatus={5}
                >
                  <MeetingList />
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
              path="/users/mentee/profile"
              element={
                <PrivateRoute
                  path="/users/mentee/profile"
                  allowedRole={"mentee"}
                >
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/mentee/Meetings"
              element={
                <PrivateRoute
                  path="/users/mentee/Meetings"
                  allowedRole={"mentee"}
                >
                  <MeetingList />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/mentee/form"
              element={
                <PrivateRoute path="/users/mentee/form" allowedRole={"mentee"}>
                  <FeedbackForm />
                </PrivateRoute>
              }
            />
            {/*------------------- ADMIN BELOW--------------------------------*/}
            <Route
              path="/users/admin/profile"
              element={
                <PrivateRoute path="/users/admin/profile" allowedRole={"admin"}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/admin/Meetings"
              element={
                <PrivateRoute
                  path="/users/admin/Meetings"
                  allowedRole={"admin"}
                >
                  <MeetingList />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/admin/mentors"
              element={
                <PrivateRoute path="/users/admin/mentors" allowedRole={"admin"}>
                  <MentorsList />
                  <MtechMentorsList />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/admin/mentees"
              element={
                <PrivateRoute path="/users/admin/mentees" allowedRole={"admin"}>
                  <MenteesList />
                  <MtechMenteesList />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/admin/form"
              element={
                <PrivateRoute path="/users/admin/form" allowedRole={"admin"}>
                  <FormList />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/admin/form-management"
              element={
                <PrivateRoute path="/users/admin/form-management" allowedRole={"admin"}>
                  <FormManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/users/admin/form-responses"
              element={
                <PrivateRoute
                  path="/users/admin/form-responses"
                  allowedRole={"admin"}
                >
                  <FormResponses />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/users/admin/mentors/:mentorId"
              component={MentorProfile}
            />
            <Route
              path="/users/admin/mentors/:menteeId"
              component={MenteeProfile}
            /> */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
