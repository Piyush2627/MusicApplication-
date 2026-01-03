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
        `${import.meta.env.VITE_API_BASE_URL}/signup`,
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
          {/* Changed to grid-cols-2 */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* SECTION 1: Account & Personal Details */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-700">
                <FaUser className="text-violet-600" /> Account & Personal
                Details
              </h3>
              <fieldset>
                <div className="grid grid-cols-1 gap-6">
                  {/* Account Fields */}
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

                  {/* Divider for visual separation */}
                  <div className="my-2 border-t border-gray-100"></div>

                  {/* Personal Fields (Moved here for balance) */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  </div>
                </div>
              </fieldset>
            </div>

            {/* SECTION 2: Enrollment & Address */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold text-gray-700">
                <FaMusic className="text-violet-600" /> Enrollment & Location
              </h3>
              <fieldset>
                <div className="grid grid-cols-1 gap-6">
                  {/* Enrollment Fields */}
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
                    options={["Raaga"]}
                    Icon={FaHome}
                  />

                  {/* Divider for visual separation */}
                  <div className="my-2 border-t border-gray-100"></div>

                  {/* Address Fields */}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                  </div>
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
            className="w-full transform rounded-lg bg-gradient-to-r from-violet-600 to-indigo-700 px-4 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
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
