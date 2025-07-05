import { useState, type ChangeEvent, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import CustomInput from "../components/common/CustomInput";

function StudentSignUpPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    role: "student",
    StudentsId: {
      studentName: "",
      studentsEmail: "",
      studentsMobileNumber: "",
      studentsInstruments: "",
      studentsBranch: "",
      studentsAge: "",
      studentsProfile: "",
      studentsJoiningDate: new Date(),
      StudentsStatus: "Active",
      studentsAddress: {
        country: "India",
        city: "Pune",
        address: "",
      },
    },
  });

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (
      [
        "studentsMobileNumber",
        "studentsInstruments",
        "studentsBranch",
        "studentsAge",
      ].includes(name)
    ) {
      setForm((prev) => ({
        ...prev,
        StudentsId: {
          ...prev.StudentsId,
          [name]: value,
        },
      }));
    } else if (["city", "address"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        StudentsId: {
          ...prev.StudentsId,
          studentsAddress: {
            ...prev.StudentsId.studentsAddress,
            [name]: value,
          },
        },
      }));
    } else if (name === "userName") {
      setForm((prev) => ({
        ...prev,
        userName: value,
        StudentsId: {
          ...prev.StudentsId,
          studentName: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      StudentsId: {
        ...prev.StudentsId,
        studentsEmail: prev.email,
      },
    }));
  }, [form.email]);

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const preparedData = {
        ...form,
        StudentsId: {
          ...form.StudentsId,
          studentsMobileNumber: Number(form.StudentsId.studentsMobileNumber),
          studentsAge: Number(form.StudentsId.studentsAge),
          studentsInstruments: form.StudentsId.studentsInstruments
            ? form.StudentsId.studentsInstruments
                .split(",")
                .map((i) => i.trim())
            : [],
        },
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/signup`,
        preparedData,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Signup successful!");
      navigate("/login");
    },
    onError: (error: any) => {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed!");
    },
  });

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
          <CustomInput
            label="Name"
            name="userName"
            value={form.userName}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Email"
            name="email"
            value={form.email}
            onChange={handleOnChange}
            type="email"
          />
          <CustomInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleOnChange}
            type="password"
          />
          <CustomInput
            label="Mobile Number"
            name="studentsMobileNumber"
            value={form.StudentsId.studentsMobileNumber}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Instruments (comma-separated)"
            name="studentsInstruments"
            value={form.StudentsId.studentsInstruments}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Age"
            name="studentsAge"
            type="number"
            value={form.StudentsId.studentsAge}
            onChange={handleOnChange}
          />
          <SelectField
            label="City"
            name="city"
            value={form.StudentsId.studentsAddress.city}
            onChange={handleOnChange}
            options={["Pune", "Dhule", "Shirpur", "Arthe Shirpur"]}
          />
          <SelectField
            label="Residence"
            name="studentsBranch"
            value={form.StudentsId.studentsBranch}
            onChange={handleOnChange}
            options={[
              "7PD",
              "VTP Hi-life",
              "Rose-e-Meher",
              "Signature park",
              "Shivangan",
              "Sai Vista",
              "Lodha Blemendo Gahunje",
              "Kunal iconia Kiwle",
              "Godrej Kiwle",
              "Kolthe patil Kiwle",
              "Range Hill Jr Staff club",
              "IDSE Office Khadki",
              "Other",
            ]}
          />
          <CustomInput
            label="Address"
            name="address"
            value={form.StudentsId.studentsAddress.address}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Student Email (auto-filled)"
            name="studentsEmail"
            value={form.StudentsId.studentsEmail}
            readOnly
            hidden
          />
        </div>

        <button
          onClick={() => mutate()}
          className="mt-6 w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:opacity-60"
          disabled={isPending}
        >
          {isPending ? "Signing Up..." : "Sign Up"}
        </button>

        <div className="text-center text-sm">
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Already have an account?
          </Link>
        </div>
        <div className="text-center text-sm">
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

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}) => (
  <div className="md:col-span-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);
