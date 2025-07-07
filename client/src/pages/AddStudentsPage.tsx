import { useState, type ChangeEvent, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import CustomInput from "../components/common/CustomInput";
import toast, { Toaster } from "react-hot-toast";

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

  // Sync studentsEmail with email
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

  return (
    <div className="w-full p-6">
      <Toaster position="top-right" />
      <div className="w-full rounded-xl border border-gray-200 p-6 shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">
          Add New Student
        </h2>

        <div className="space-y-4">
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
          />
          <CustomInput
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Mobile Number"
            name="studentsMobileNumber"
            type="number"
            value={form.StudentsId.studentsMobileNumber}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Instrument (comma-separated)"
            name="studentsInstruments"
            value={form.StudentsId.studentsInstruments}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Branch"
            name="studentsBranch"
            value={form.StudentsId.studentsBranch}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Age"
            name="studentsAge"
            type="number"
            value={form.StudentsId.studentsAge}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Country"
            name="country"
            value={form.StudentsId.studentsAddress.country}
            onChange={handleOnChange}
          />
          <CustomInput
            label="City"
            name="city"
            value={form.StudentsId.studentsAddress.city}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Address"
            name="address"
            value={form.StudentsId.studentsAddress.address}
            onChange={handleOnChange}
          />
        </div>

        <div className="mt-6">
          <button
            onClick={() => addUserAndStudent()}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddStudentsPage;
