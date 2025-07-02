import { useState, type ChangeEvent } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function AdminSignUpPage() {
  const navigate = useNavigate();
  const [isUserRegistration, setIsUserRegistration] = useState({
    userName: "",
    email: "",
    password: "",
    role: "admin",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsUserRegistration((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const registerUserOnclick = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/signup`,
        isUserRegistration,
      );
      console.log(res);
      toast.success("Admin signup successful!");
      navigate("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Admin signup failed!");
    }
  };

  return (
    <div>
      <Toaster />
      <div className="flex h-screen">
        <div className="hidden flex-1 items-center justify-center text-black lg:flex">
          <div className="max-w-md text-center">
            <img src="/src/assets/images/image.png" alt="" />
          </div>
        </div>
        <div className="flex w-full items-center justify-center bg-gray-100 lg:w-1/2">
          <div className="w-full max-w-md p-6">
            <h1 className="mb-6 text-center text-3xl font-semibold text-black">
              Admin Sign Up
            </h1>
            <h1 className="mb-6 text-center text-sm font-semibold text-gray-500">
              Join to Our Community with all time access and free{" "}
            </h1>

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
                className="mt-1 w-full rounded-md border p-2 transition-colors duration-300 focus:border-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
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
                type="text"
                id="email"
                name="email"
                value={isUserRegistration.email}
                onChange={handleOnChange}
                className="mt-1 w-full rounded-md border p-2 transition-colors duration-300 focus:border-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
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
                className="mt-1 w-full rounded-md border p-2 transition-colors duration-300 focus:border-gray-200 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none"
              />
            </div>
            <div>
              <button
                onClick={registerUserOnclick}
                className="mt-4 w-full rounded-md bg-black p-2 text-white transition-colors duration-300 hover:bg-gray-800 focus:bg-black focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 focus:outline-none"
              >
                Sign Up
              </button>
            </div>
            <Link to="/login">
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Already have an account? </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminSignUpPage;
