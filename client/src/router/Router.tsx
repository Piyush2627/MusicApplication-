import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import SignUp from "../pages/SignUp";
import StudentsDashboardPage from "../pages/StudentsDashboardPage";
import AddStudentsPage from "../pages/AddStudentsPage";
import UpdateImagePage from "../pages/UpdateImagePage";
import UserList from "../pages/UserList";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "../utils/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import HomePage from "../pages/HomePage";
import AttendanceDashboard from "../pages/AttendanceDashboard";
import BatchPage from "../pages/BatchPage";
import StudentsInformationPage from "../pages/StudentsInformationPage";
import EnquiryPage from "../pages/EnquiryPage";
import EditStudentsPage from "../pages/EditStudentsPage";
import EditBatch from "../pages/EditBatch";
import StudentsProfiles from "../pages/StudentsProfiles";
import Instruments from "../components/Instruments";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <SignUp /> },

      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/",
            element: <DashboardLayout />,
            children: [
              { path: "/", element: <StudentsDashboardPage /> },
              { path: "/add-students", element: <AddStudentsPage /> },
              {
                path: "/attendanceDashboard",
                element: <AttendanceDashboard />,
              },
              { path: "/batch", element: <BatchPage /> },
              { path: "/enquiry", element: <EnquiryPage /> },
              { path: "/studentsProfiles", element: <StudentsProfiles /> },
              {
                path: "/studentsInfo/:studentsId",
                element: <StudentsInformationPage />,
              },
              {
                path: "/editStudentInfoPage/:Id",
                element: <EditStudentsPage />,
              },
              { path: "/editBatch/:batchId", element: <EditBatch /> },
              { path: "/instruments", element: <Instruments /> },
            ],
          },
          { path: "/update-image/:id", element: <UpdateImagePage /> },
          { path: "/user-list", element: <UserList /> },
        ],
      },

      {
        path: "*",
        element: <div>404 - Not Found</div>,
      },
    ],
  },
]);

const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router;
