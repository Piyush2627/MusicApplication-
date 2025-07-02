import { useState, type ChangeEvent, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

type FormData = {
  userName: string;
  email: string;
  password: string;
  role: string;
  studentName?: string;
  studentsEmail?: string;
  studentsMobileNumber?: string;
  studentsInstruments?: string[];
  studentsBranch?: string;
  studentsAge?: number;
  address?: string;
};

function StudentSignUpPage() {
  const navigate = useNavigate();
  const [isUserRegistration, setIsUserRegistration] = useState<FormData>({
    userName: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIsUserRegistration((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setIsUserRegistration((prev) => ({
      ...prev,
      studentsEmail: prev.email,
    }));
  }, [isUserRegistration.email]);

  const registerUserOnclick = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/signup`,
        isUserRegistration,
      );
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Toaster />
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Student Sign Up</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join our community for full access and benefits.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              User Name
            </label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={isUserRegistration.userName}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={isUserRegistration.email}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={isUserRegistration.password}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="studentName"
              className="block text-sm font-medium text-gray-700"
            >
              Student Name
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={isUserRegistration.studentName || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="studentsEmail"
              className="block text-sm font-medium text-gray-700"
            >
              Student Email
            </label>
            <input
              type="email"
              id="studentsEmail"
              name="studentsEmail"
              value={isUserRegistration.studentsEmail || ""}
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="studentsMobileNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Student Mobile Number
            </label>
            <input
              type="text"
              id="studentsMobileNumber"
              name="studentsMobileNumber"
              value={isUserRegistration.studentsMobileNumber || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="studentsInstruments"
              className="block text-sm font-medium text-gray-700"
            >
              Instruments
            </label>
            <input
              type="text"
              id="studentsInstruments"
              name="studentsInstruments"
              value={isUserRegistration.studentsInstruments || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="studentsBranch"
              className="block text-sm font-medium text-gray-700"
            >
              Branch
            </label>
            <input
              type="text"
              id="studentsBranch"
              name="studentsBranch"
              value={isUserRegistration.studentsBranch || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="studentsAge"
              className="block text-sm font-medium text-gray-700"
            >
              Age
            </label>
            <input
              type="number"
              id="studentsAge"
              name="studentsAge"
              value={isUserRegistration.studentsAge || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={isUserRegistration.address || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            onClick={registerUserOnclick}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign Up
          </button>
        </div>
        <div className="text-sm text-center">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account?
          </Link>
        </div>
        <div className="text-sm text-center mt-2">
          <Link
            to="/admin-signup"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Admin Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentSignUpPage;
