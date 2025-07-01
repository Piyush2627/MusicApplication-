import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { type StudentsType } from "../types/index.types";
import toast, { Toaster } from "react-hot-toast";
import CustomInput from "../components/common/CustomInput";

const EditStudentPage = () => {
  const { Id } = useParams<{ Id: string }>();
  //notification
  const notify = () => toast.success("Student Updated.");

  if (!Id) {
    return (
      <div className="mt-10 text-center text-red-500">
        No student ID found in URL.
      </div>
    );
  }

  const {
    data: studentData,
    isLoading,
    isError,
  } = useQuery<StudentsType>({
    queryKey: ["student", Id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/getStudent/${Id}`,
      );
      return res.data;
    },
    enabled: !!Id,
  });

  const [form, setForm] = useState<StudentsType>({
    _id: "",
    studentName: "",
    studentsEmail: "",
    studentsMobileNumber: "0",
    studentsBranch: "",
    studentsAge: "0",
    target: "",
    studentsJoiningDate: new Date(),
    studentsInstruments: "",
    StudentsStatus: "",
    studentsProfile: "",
    studentsAddress: {
      country: "",
      city: "",
      address: "",
    },
  });

  useEffect(() => {
    if (studentData) {
      setForm(studentData);
    }
  }, [studentData]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name.startsWith("studentsAddress.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        studentsAddress: {
          ...prev.studentsAddress,
          [key]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]:
          name.includes("Number") || name === "studentsAge"
            ? Number(value)
            : value,
      }));
    }
  };

  const mutation = useMutation({
    mutationFn: async (updatedData: StudentsType) => {
      return axios.put(`/api/updateStudent/${Id}`, updatedData);
    },
    onSuccess: () => {
      notify();
    },
    onError: () => {
      toast.error("Failed to update student.");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (form) mutation.mutate(form);
  };

  if (isLoading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="mt-10 text-center text-red-500">
        Error loading student data.
      </div>
    );
  }

  return (
    <div className="bg-white p-8 shadow-lg ring-1 ring-gray-200">
      <Toaster />
      <h2 className="mb-6 text-center text-3xl font-semibold text-gray-800">
        Edit Student
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Student Name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Name
          </label>
          <CustomInput
            name="studentName"
            value={form.studentName}
            onChange={handleChange}
            placeholder="Enter student name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <CustomInput
            name="studentsEmail"
            type="email"
            value={form.studentsEmail}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <CustomInput
            name="studentsMobileNumber"
            type="tel"
            value={form.studentsMobileNumber}
            onChange={handleChange}
            placeholder="Enter mobile number"
          />
        </div>

        {/* Branch */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Branch
          </label>
          <CustomInput
            name="studentsBranch"
            value={form.studentsBranch}
            onChange={handleChange}
            placeholder="Enter branch"
          />
        </div>

        {/* Age */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Age
          </label>
          <CustomInput
            name="studentsAge"
            type="number"
            value={form.studentsAge}
            onChange={handleChange}
            placeholder="Enter age"
          />
        </div>
        <div className="flex">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              name="studentsAddress.country"
              value={form.studentsAddress.country}
              onChange={handleChange}
            >
              <option value="default">Select A Country</option>
              <option value="India">India</option>
              <option value="Australia">Australia</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Student
            </label>
            <select
              name="StudentsStatus"
              value={form.StudentsStatus}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Freezed">Freezed</option>
            </select>
          </div>
        </div>
        {/* City */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            City
          </label>
          <CustomInput
            name="studentsAddress.city"
            value={form.studentsAddress.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        {/* Street Address */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Street Address
          </label>
          <CustomInput
            name="studentsAddress.address"
            value={form.studentsAddress.address}
            onChange={handleChange}
            placeholder="Enter street address"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          {mutation.isPending ? "Updating..." : "Update Student"}
        </button>
      </form>
    </div>
  );
};

export default EditStudentPage;
