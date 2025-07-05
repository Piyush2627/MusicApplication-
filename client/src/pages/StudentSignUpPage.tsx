import { useState, type ChangeEvent, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import type { UserType } from "../types/index.types";

function StudentSignUpPage() {
  const navigate = useNavigate();
  const [isUserRegistration, setIsUserRegistration] = useState<UserType>({
    userName: "",
    email: "",
    password: "",
    role: "student",
    StudentsId: {
      _id: "",
      studentName: "",
      studentsEmail: "",
      studentsMobileNumber: 0,
      studentsJoiningDate: new Date(),
      studentsInstruments: [],
      studentsBranch: "",
      studentsAge: 0,
      studentsProfile: "",
      target: "",
      studentsAddress: {
        country: "India",
        city: "Pune",
        address: "",
      },
      StudentsStatus: "Active",
    },
  });

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
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
      console.log(res);
      toast.success("Signup successful!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Toaster />
      <div className="w-full max-w-lg space-y-6 rounded-lg bg-white p-8 shadow-md">
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
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
              value={isUserRegistration.StudentsId?.studentName || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
              value={isUserRegistration.StudentsId?.studentsEmail || ""}
              readOnly
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
              value={isUserRegistration.StudentsId?.studentsMobileNumber || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
              value={isUserRegistration.StudentsId?.studentsInstruments || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
              value={isUserRegistration.StudentsId?.studentsBranch || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
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
              value={isUserRegistration.StudentsId?.studentsAge || ""}
              onChange={handleOnChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <select
              id="city"
              name="StudentsId.studentsAddress.city"
              value={isUserRegistration?.StudentsId?.studentsAddress.city}
              onChange={handleOnChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            >
              <option value="Pune">Pune</option>
              <option value="Dhule">Dhule</option>
              <option value="Shirpur">Shirpur</option>
              <option value="Arthe Shirpur">Arthe Shirpur</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="City"
              className="block text-sm font-medium text-gray-700"
            >
              Residence
            </label>
            <select
              id="Branch"
              name="StudentsId.studentsBranch"
              value={isUserRegistration?.StudentsId?.studentsBranch}
              onChange={handleOnChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            >
              <option value="">Select Residence</option>
              <option value="7PD">7PD</option>
              <option value="VTP Hi-life">VTP Hi-life</option>
              <option value="Rose-e-Meher">Rose-e-Meher</option>
              <option value="Signature park">Signature park</option>
              <option value="Shivangan">Shivangan</option>
              <option value="Sai Vista">Sai Vista</option>
              <option value="Lodha Blemendo Gahunje">
                Lodha Blemendo Gahunje
              </option>
              <option value="Kunal iconia Kiwle">Kunal iconia Kiwle</option>
              <option value="Godrej Kiwle">Godrej Kiwle</option>
              <option value="Kolthe patil Kiwle">Kolthe patil Kiwle</option>
              <option value="Range Hill Jr Staff club">
                Range Hill Jr Staff club
              </option>
              <option value="IDSE Office Khadki">IDSE Office Khadki</option>
              <option value="Other">Other</option>
            </select>
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
              value={
                isUserRegistration.StudentsId?.studentsAddress.address || ""
              }
              onChange={handleOnChange}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button
            onClick={registerUserOnclick}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
          >
            Sign Up
          </button>
        </div>
        <div className="text-center text-sm">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account?
          </Link>
        </div>
        <div className="mt-2 text-center text-sm">
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
