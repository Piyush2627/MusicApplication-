import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { UserType } from "../types/index.types";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [isLoginInput, setIsLoginInput] = useState<UserType>({
    email: "",
    password: "",
    userName: "demo",
  });
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/loginUser", isLoginInput);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/"); // redirect to dashboard after successful login
      } else {
        setError("No token received");
      }
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || "Login failed");
    },
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIsLoginInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Left Side Illustration */}
      <div className="hidden flex-1 items-center justify-center text-black lg:flex">
        <div className="max-w-md text-center">
          <img
            className=""
            src="https://img.freepik.com/free-vector/landscape-design-abstract-concept-vector-illustration-landscape-planning-rules-tips-gardening-services-frond-backyard-architecture-diy-ideas-vertical-rooftop-garden-abstract-metaphor_335657-6154.jpg?ga=GA1.1.328761067.1741070722&semt=ais_hybrid&w=740"
            alt="illustration"
          />
        </div>
      </div>

      {/* Right Side Login Form */}
      <div className="flex w-full items-center justify-center bg-gray-100 lg:w-1/2">
        <div className="w-full max-w-md p-6">
          <h1 className="mb-2 text-center text-3xl font-semibold text-black">
            Login
          </h1>
          <p className="mb-6 text-center text-sm text-gray-500">
            Join our community with all-time access and free resources
          </p>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={isLoginInput.email}
              onChange={handleOnChange}
              name="email"
              className="mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={isLoginInput.password}
              onChange={handleOnChange}
              name="password"
              className="mt-1 w-full rounded-md border p-2 focus:ring-2 focus:ring-gray-300 focus:outline-none"
            />
          </div>

          {error && <div className="mb-4 text-sm text-red-500">{error}</div>}

          <button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="w-full rounded-md bg-black p-2 text-white transition duration-300 hover:bg-gray-800 focus:ring-2 focus:ring-gray-900 focus:outline-none"
          >
            {mutation.isPending ? "Logging in..." : "Login"}
          </button>

          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
