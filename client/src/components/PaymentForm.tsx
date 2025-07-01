import React, { useState, useEffect, type FormEvent } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Student {
  _id: string;
  studentName: string;
}

interface Payment {
  _id?: string;
  student: string;
  amount: number;
  classesAttended?: number;
  status?: "paid" | "unpaid";
  paymentDate?: string;
}

const PaymentForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [studentSearch, setStudentSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [classesAttended, setClassesAttended] = useState("8"); // default value from schema
  const [status, setStatus] = useState<"paid" | "unpaid">("unpaid");

  // Fetch students list
  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/getAllStudent`,
      );
      return res.data;
    },
  });

  // Filter students
  useEffect(() => {
    const filtered = students.filter((student) =>
      student.studentName.toLowerCase().includes(studentSearch.toLowerCase()),
    );
    setFilteredStudents(filtered);
  }, [studentSearch, students]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (payment: Payment) => {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment`,
        payment,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      // Reset form
      setSelectedStudent(null);
      setStudentSearch("");
      setAmount("");
      setDate("");
      setClassesAttended("8");
      setStatus("unpaid");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !amount) return;

    mutate({
      student: selectedStudent._id,
      amount: parseFloat(amount),
      classesAttended: parseInt(classesAttended),
      status,
      paymentDate: date || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-lg space-y-4 rounded bg-white p-6 shadow-md"
    >
      <h2 className="text-xl font-semibold">Add Payment</h2>

      {/* Student Search Input */}
      <input
        type="text"
        placeholder="Search student by name"
        value={selectedStudent?.studentName || studentSearch}
        onChange={(e) => {
          setStudentSearch(e.target.value);
          setSelectedStudent(null);
        }}
        className="w-full rounded border px-4 py-2"
      />

      {/* Student Dropdown */}
      {studentSearch && !selectedStudent && (
        <ul className="max-h-40 overflow-y-auto rounded border bg-white shadow">
          {filteredStudents.map((student) => (
            <li
              key={student._id}
              onClick={() => {
                setSelectedStudent(student);
                setStudentSearch("");
              }}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100"
            >
              {student.studentName}
            </li>
          ))}
        </ul>
      )}

      {/* Amount */}
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full rounded border px-4 py-2"
      />

      {/* Classes Attended */}
      <input
        type="number"
        placeholder="Classes Attended"
        value={classesAttended}
        onChange={(e) => setClassesAttended(e.target.value)}
        className="w-full rounded border px-4 py-2"
      />

      {/* Payment Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full rounded border px-4 py-2"
      />

      {/* Status Select */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "paid" | "unpaid")}
        className="w-full rounded border px-4 py-2"
      >
        <option value="unpaid">Unpaid</option>
        <option value="paid">Paid</option>
      </select>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!selectedStudent || isPending}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit Payment"}
      </button>

      {isError && (
        <p className="mt-2 text-sm text-red-600">Error adding payment.</p>
      )}
    </form>
  );
};

export default PaymentForm;
