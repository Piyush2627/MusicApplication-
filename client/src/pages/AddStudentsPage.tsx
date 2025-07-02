import { useState, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import CustomInput from "../components/common/CustomInput";
import type { StudentsType } from "../types/index.types";

const defaultStudent: StudentsType = {
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
};

function AddStudentsPage() {
  const [isStudentInput, setIsStudentsInput] =
    useState<StudentsType>(defaultStudent);

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (name === "studentsInstruments") {
      setIsStudentsInput((prev) => ({
        ...prev,
        studentsInstruments: value.split(",").map((item) => item.trim()),
      }));
    } else if (name.startsWith("studentsAddress.")) {
      const addressField = name.split(".")[1];
      setIsStudentsInput((prev) => ({
        ...prev,
        studentsAddress: {
          ...prev.studentsAddress,
          [addressField]: value,
        },
      }));
    } else {
      setIsStudentsInput((prev) => ({
        ...prev,
        [name]:
          type === "number"
            ? parseInt(value) || 0
            : name === "studentsJoiningDate"
              ? new Date(value)
              : value,
      }));
    }
  };

  const {
    mutate: addStudent,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: async (newStudent: StudentsType) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/createStudent`,
        newStudent,
      );
      return response.data;
    },
    onSuccess: () => {
      alert("Student added successfully");
      setIsStudentsInput(defaultStudent);
    },
    onError: (err) => {
      console.error("Error adding student:", err);
    },
  });

  const AddStudentsData = () => {
    addStudent(isStudentInput);
  };

  return (
    <div className="w-full p-6">
      <div className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md">
        <h2 className="mb-6 text-3xl font-bold text-gray-800">
          Add New Student
        </h2>

        <div className="space-y-4">
          <CustomInput
            label="Student Name"
            name="studentName"
            value={isStudentInput.studentName}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Email"
            name="studentsEmail"
            value={isStudentInput.studentsEmail}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Mobile Number"
            name="studentsMobileNumber"
            type="number"
            value={isStudentInput.studentsMobileNumber.toString()}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Instrument (comma-separated)"
            name="studentsInstruments"
            value={isStudentInput.studentsInstruments.join(", ")}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Branch"
            name="studentsBranch"
            value={isStudentInput.studentsBranch}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Age"
            name="studentsAge"
            type="number"
            value={isStudentInput.studentsAge.toString()}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Country"
            name="studentsAddress.country"
            value={isStudentInput.studentsAddress.country || ""}
            onChange={handleOnChange}
          />
          <CustomInput
            label="City"
            name="studentsAddress.city"
            value={isStudentInput.studentsAddress.city || ""}
            onChange={handleOnChange}
          />
          <CustomInput
            label="Address"
            name="studentsAddress.address"
            value={isStudentInput.studentsAddress.address || ""}
            onChange={handleOnChange}
          />
        </div>

        <div className="mt-6">
          <button
            onClick={AddStudentsData}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add Student"}
          </button>

          {isSuccess && (
            <p className="mt-3 text-sm font-medium text-green-600">
              Student added!
            </p>
          )}
          {isError && (
            <p className="mt-3 text-sm font-medium text-red-600">
              Failed to add student: {(error as Error).message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddStudentsPage;
