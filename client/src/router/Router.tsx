import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import StudentsDashboardPage from "../pages/StudentsDashboardPage";
import AddStudentsPage from "../pages/AddStudentsPage";
import UpdateImagePage from "../pages/UpdateImagePage";
import UserList from "../pages/UserList";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../utils/ProtectedRoute";
import HomePage from "../pages/HomePage";
import AttendanceDashboard from "../pages/AttendanceDashboard";
import BatchPage from "../pages/BatchPage";
import StudentsInformationPage from "../pages/StudentsInformationPage";
import EnquiryPage from "../pages/EnquiryPage";
import EditStudentsPage from "../pages/EditStudentsPage";
import EditBatch from "../pages/EditBatch";
import StudentsProfiles from "../pages/StudentsProfiles";
import Instruments from "../components/Instruments";
import AdminLayout from "../layouts/AdminLayout";
import StudentLayout from "../layouts/StudentLayout";
import SettingsPage from "../pages/SettingsPage";
import AdminSignUpPage from "../pages/AdminSignUpPage";
import StudentSignUpPage from "../pages/StudentSignUpPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <StudentSignUpPage /> },
      { path: "admin-signup", element: <AdminSignUpPage /> },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "admin",
            element: <AdminLayout />,
            children: [
              { path: "dashboard", element: <StudentsDashboardPage /> },
              { path: "add-students", element: <AddStudentsPage /> },
              {
                path: "attendanceDashboard",
                element: <AttendanceDashboard />,
              },
              { path: "batch", element: <BatchPage /> },
              { path: "enquiry", element: <EnquiryPage /> },
              { path: "studentsProfiles", element: <StudentsProfiles /> },
              {
                path: "studentsInfo/:studentsId",
                element: <StudentsInformationPage />,
              },
              {
                path: "editStudentInfoPage/:Id",
                element: <EditStudentsPage />,
              },
              { path: "editBatch/:batchId", element: <EditBatch /> },
              { path: "instruments", element: <Instruments /> },
              { path: "user-list", element: <UserList /> },
              { path: "settings", element: <SettingsPage /> },
            ],
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["student"]} />,
        children: [
          {
            path: "student",
            element: <StudentLayout />,
            children: [
              { path: "dashboard", element: <StudentsDashboardPage /> },
              { path: "profile", element: <StudentsProfiles /> },
              { path: "settings", element: <SettingsPage /> },
            ],
          },
        ],
      },
      {
        path: "update-image/:id",
        element: <UpdateImagePage />,
      },
      {
        path: "*",
        element: <div>404 - Not Found</div>,
      },
      {
        path: "unauthorized",
        element: <div>401 - Unauthorized</div>,
      },
    ],
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
