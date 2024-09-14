import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Signup/Signup";
import Chatbot from "./Pages/Chatbot/chatbot";
import UserDashboard from "./Pages/UserDashboard/UserDashboard";
import AllUsersPage from "./Pages/AllUsersPage/AllUsersPage";
import Generatereport from "./Pages/GenerateReport/generatereport";
import AdminDocumentPage from "./Pages/AdminDocument/AdminDocumentPage";
import Layout from "./Layout/Layout";
import { FileProvider } from "./Pages/FileContext/filecontext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AuthenticatedRoute,
  AdminRoute,
} from "./RouteCategories/RouteCategories";
import userAuthStore from "./stores/userauth/userauth";

function App() {
  const user = userAuthStore((state) => state.user);

  return (
    <div>
      <Router>
        <Layout />
        <FileProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Authenticated routes */}
            <Route
              path="/chatbot"
              element={
                <AuthenticatedRoute user={user}>
                  <Chatbot />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <AuthenticatedRoute user={user}>
                  <Chatbot />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/user/dashboard"
              element={
                <AuthenticatedRoute user={user}>
                  <UserDashboard />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/user/generatereport"
              element={
                <AuthenticatedRoute user={user}>
                  <Generatereport />
                </AuthenticatedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/admin/all-users"
              element={
                <AdminRoute user={user}>
                  <AllUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/documents"
              element={
                <AdminRoute user={user}>
                  <AdminDocumentPage />
                </AdminRoute>
              }
            />
          </Routes>
        </FileProvider>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
