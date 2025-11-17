import { useState, type ChangeEvent, useEffect, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import CustomInput from "../components/common/CustomInput";
import toast, { Toaster } from "react-hot-toast";
import SelectField from "../components/common/SelectField";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMusic,
  FaHome,
  FaMapMarkerAlt,
  FaGlobe,
  FaCity,
} from "react-icons/fa";

function AddStudentsPage() {
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
    } else if (["country", "city", "address"].includes(name)) {
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

  const { mutate: addUserAndStudent, isPending } = useMutation({
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
      toast.success("Student and user added successfully");
      setForm({
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
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add student.");
      console.error("Error adding student:", err);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addUserAndStudent();
  };

  return (
    <div className="min-h-screen w-full bg-white p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold tracking-wider text-gray-800">
            Add New Student
          </h2>
          <p className="text-md mt-2 text-gray-600">
            Create a new student profile and user account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Account Information</h3>
              <fieldset>
                <div className="grid grid-cols-1 gap-6">
                  <CustomInput
                    label="Full Name"
                    name="userName"
                    value={form.userName}
                    onChange={handleOnChange}
                    Icon={FaUser}
                  />
                  <CustomInput
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleOnChange}
                    Icon={FaEnvelope}
                  />
                  <CustomInput
                    label="Password"
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleOnChange}
                    Icon={FaLock}
                  />
                </div>
              </fieldset>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Student Details</h3>
              <fieldset>
                <div className="grid grid-cols-1 gap-6">
                  <CustomInput
                    label="Mobile Number"
                    name="studentsMobileNumber"
                    type="number"
                    value={form.StudentsId.studentsMobileNumber}
                    onChange={handleOnChange}
                    Icon={FaPhone}
                  />
                  <CustomInput
                    label="Age"
                    name="studentsAge"
                    type="number"
                    value={form.StudentsId.studentsAge}
                    onChange={handleOnChange}
                  />
                  <CustomInput
                    label="Instrument(s) (comma-separated)"
                    name="studentsInstruments"
                    value={form.StudentsId.studentsInstruments}
                    onChange={handleOnChange}
                    Icon={FaMusic}
                  />
                  <SelectField
                    label="Branch / Residence"
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
                    Icon={FaHome}
                  />
                </div>
              </fieldset>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">Address</h3>
              <fieldset>
                <div className="grid grid-cols-1 gap-6">
                  <SelectField
                    label="Country"
                    name="country"
                    value={form.StudentsId.studentsAddress.country}
                    onChange={handleOnChange}
                    options={["India", "Australia"]}
                    Icon={FaGlobe}
                  />
                  <SelectField
                    label="City"
                    name="city"
                    value={form.StudentsId.studentsAddress.city}
                    onChange={handleOnChange}
                    options={["Pune", "Dhule", "Shirpur", "Arthe Shirpur"]}
                    Icon={FaCity}
                  />
                  <CustomInput
                    label="Street Address"
                    name="address"
                    value={form.StudentsId.studentsAddress.address}
                    onChange={handleOnChange}
                    Icon={FaMapMarkerAlt}
                  />
                </div>
              </fieldset>
            </div>
          </div>

          <button
            type="submit"
            className="w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Student"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddStudentsPage;
