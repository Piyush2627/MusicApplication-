import React, { useState, type FormEvent, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Student {
  _id: string;
  studentName: string;
}

interface Batch {
  batchName: string;
  batchInstructor: string;
  batchInstrument?: string;
  batchTiming: string;
  batchStudents: string[];
  batchStartDate?: string;
  batchBranch?: string;
}

export const CreateBatchForm: React.FC = () => {
  const queryClient = useQueryClient();
  const [studentSearch, setStudentSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await axios.get("/api/getAllStudent");
      return res.data;
    },
  });

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (newBatch: Batch) => {
      const res = await axios.post("/api/batches", newBatch);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });

  const [batchName, setBatchName] = useState("");
  const [batchInstructor, setBatchInstructor] = useState("");
  const [batchInstrument, setBatchInstrument] = useState("");
  const [batchTiming, setBatchTiming] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [batchStartDate, setBatchStartDate] = useState("");
  const [batchBranch, setBatchBranch] = useState("");

  useEffect(() => {
    const filtered = students.filter((student) =>
      student.studentName.toLowerCase().includes(studentSearch.toLowerCase()),
    );
    setFilteredStudents(filtered);
  }, [studentSearch, students]);

  const handleAddStudent = (student: Student) => {
    if (!selectedStudentIds.includes(student._id)) {
      setSelectedStudentIds((prev) => [...prev, student._id]);
    }
    setStudentSearch("");
    setFilteredStudents([]);
  };

  const handleRemoveStudent = (studentId: string) => {
    setSelectedStudentIds((prev) => prev.filter((id) => id !== studentId));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newBatch: Batch = {
      batchName,
      batchInstructor,
      batchInstrument: batchInstrument || undefined,
      batchTiming,
      batchStudents: selectedStudentIds,
      batchStartDate: batchStartDate
        ? new Date(batchStartDate).toISOString()
        : undefined,
      batchBranch: batchBranch || undefined,
    };

    mutate(newBatch);

    // Reset form
    setBatchName("");
    setBatchInstructor("");
    setBatchInstrument("");
    setBatchTiming("");
    setSelectedStudentIds([]);
    setBatchStartDate("");
    setBatchBranch("");
    setStudentSearch("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg bg-white p-6 shadow-lg"
    >
      <h2 className="text-2xl font-semibold">Create New Batch</h2>

      <input
        required
        value={batchName}
        onChange={(e) => setBatchName(e.target.value)}
        placeholder="Batch Name"
        className="w-full rounded border px-3 py-2"
      />

      <input
        required
        value={batchInstructor}
        onChange={(e) => setBatchInstructor(e.target.value)}
        placeholder="Instructor ID"
        className="w-full rounded border px-3 py-2"
      />

      <input
        value={batchInstrument}
        onChange={(e) => setBatchInstrument(e.target.value)}
        placeholder="Instrument (optional)"
        className="w-full rounded border px-3 py-2"
      />

      <input
        required
        value={batchTiming}
        onChange={(e) => setBatchTiming(e.target.value)}
        placeholder="Timing (e.g., Mon-Wed 5PM)"
        className="w-full rounded border px-3 py-2"
      />

      <input
        type="text"
        value={studentSearch}
        onChange={(e) => setStudentSearch(e.target.value)}
        placeholder="Search students by name"
        className="w-full rounded border px-3 py-2"
      />

      {studentSearch && (
        <div className="max-h-48 overflow-y-auto rounded border p-2">
          {filteredStudents.length > 0 ? (
            <ul className="mt-2 max-h-40 overflow-auto rounded border bg-white shadow">
              {filteredStudents.map((student) => (
                <li
                  key={student._id}
                  className="flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
                >
                  {student.studentName}
                  <button
                    type="button"
                    onClick={() => handleAddStudent(student)}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              No matching students found.
            </p>
          )}
        </div>
      )}

      {/* Selected Students */}
      {selectedStudentIds.length > 0 && (
        <div className="rounded border bg-gray-50 p-2">
          <h4 className="mb-1 text-sm font-semibold">Selected Students:</h4>
          <ul>
            {selectedStudentIds.map((id) => {
              const student = students.find((s) => s._id === id);
              return (
                <li key={id} className="flex justify-between text-sm">
                  {student?.studentName || id}
                  <button
                    type="button"
                    onClick={() => handleRemoveStudent(id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <input
        type="date"
        value={batchStartDate}
        onChange={(e) => setBatchStartDate(e.target.value)}
        className="w-full rounded border px-3 py-2"
      />

      <input
        value={batchBranch}
        onChange={(e) => setBatchBranch(e.target.value)}
        placeholder="Branch (optional)"
        className="w-full rounded border px-3 py-2"
      />

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Batch"}
      </button>

      {isError && <p className="text-red-500">Error creating batch.</p>}
    </form>
  );
};
