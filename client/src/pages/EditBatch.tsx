import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { type StudentsType, type ClassBatchType } from "../types/index.types";
import axios from "axios";
import { useState, useEffect, type ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

function EditBatch() {
  const notify = () => toast.success("Student Updated.");
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState<ClassBatchType>({
    _id: "",
    batchInstructor: "",
    batchName: "",
    batchStudents: [],
    batchTiming: "",
    batchBranch: "",
    batchInstrument: "",
    batchStartDate: "",
  });
  const queryClient = useQueryClient();

  const updateBatch = async (updatedBatch: ClassBatchType) => {
    const payload = {
      ...updatedBatch,
      batchStudents: updatedBatch.batchStudents.map((s) => s._id),
    };

    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/batches/${batchId}`,
      payload,
    );
    return res.data;
  };

  const { mutate, isPending: isUpdating } = useMutation({
    mutationFn: updateBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch", batchId] });
      notify();
      // Or redirect to desired route
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to update batch.");
    },
  });

  const handleSubmit = () => {
    if (!form.batchName || form.batchStudents.length === 0) {
      alert("Please fill all required fields and select at least one student.");
      return;
    }

    mutate(form);
  };

  const { batchId } = useParams();

  const fetchStudents = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/getAllStudent`,
    );
    return res.data as StudentsType[];
  };

  const fetchBatch = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/batches/${batchId}`,
    );
    return res.data as ClassBatchType;
  };

  const { data: studentData, isLoading: isStudentsLoading } = useQuery<
    StudentsType[]
  >({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const { data: batch, isLoading: isBatchLoading } = useQuery<ClassBatchType>({
    queryKey: ["batch", batchId],
    queryFn: fetchBatch,
    enabled: !!batchId,
  });

  useEffect(() => {
    if (batch) {
      setForm(batch);
    }
  }, [batch]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = (student: StudentsType) => {
    setForm((prev) => {
      const isAlreadySelected = prev.batchStudents.some(
        (s) => s._id === student._id,
      );
      if (isAlreadySelected) return prev;
      return {
        ...prev,
        batchStudents: [...prev.batchStudents, student],
      };
    });
  };

  const handleRemoveStudent = (studentId: string) => {
    setForm((prev) => ({
      ...prev,
      batchStudents: prev.batchStudents.filter((s) => s._id !== studentId),
    }));
  };

  if (!batchId) {
    return <div className="text-center text-red-500">No Batch ID found</div>;
  }

  if (isStudentsLoading || isBatchLoading) {
    return <div>Loading ...</div>;
  }

  const selectedStudentIds = new Set(form.batchStudents.map((s) => s._id));

  const existingStudents = form.batchStudents.filter((student) =>
    student.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const availableStudents =
    studentData?.filter(
      (student) =>
        !selectedStudentIds.has(student._id) &&
        student.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  return (
    <div>
      <Toaster />

      <h2 className="mb-4 text-2xl font-bold">Edit Batch</h2>

      {/* Batch Fields */}
      {["batchName", "batchTiming", "batchBranch", "batchInstrument"].map(
        (field) => (
          <div className="mb-4" key={field}>
            <label className="mb-1 block font-medium capitalize">
              {field.replace("batch", "")}
            </label>
            <input
              name={field}
              type="text"
              value={(form as any)[field]}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-3"
              placeholder={`Enter ${field.replace("batch", "").toLowerCase()}`}
            />
          </div>
        ),
      )}

      {/* 🔍 Search Students */}
      <div className="mb-6">
        <label className="mb-1 block font-medium">Search Students</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name..."
          className="w-full rounded-md border border-gray-300 p-3"
        />
      </div>

      {/* ✅ Existing Students */}
      <div className="mb-6 max-h-64 overflow-y-auto rounded-md border bg-green-50 p-3">
        <h4 className="mb-2 font-semibold text-green-700">
          Existing Students in Batch
        </h4>
        {existingStudents.length === 0 ? (
          <p className="text-gray-500">No students in this batch.</p>
        ) : (
          existingStudents.map((student) => (
            <div
              key={student._id}
              className="flex items-center justify-between border-b py-2"
            >
              <span>
                {student.studentName} ({student.studentsEmail})
              </span>
              <button
                onClick={() => handleRemoveStudent(student._id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* 🆕 Available Students */}
      <div className="mb-6 max-h-64 overflow-y-auto rounded-md border bg-blue-50 p-3">
        <h4 className="mb-2 font-semibold text-blue-700">Available Students</h4>
        {availableStudents.length === 0 ? (
          <p className="text-gray-500">No available students found.</p>
        ) : (
          availableStudents.map((student) => (
            <div
              key={student._id}
              className="flex items-center justify-between border-b py-2"
            >
              <span>
                {student.studentName} ({student.studentsEmail})
              </span>
              <button
                onClick={() => handleAddStudent(student)}
                className="text-blue-600 hover:underline"
              >
                Add
              </button>
            </div>
          ))
        )}
      </div>
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className="rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Save Changes"}
        </button>
      </div>
      {/* Optional Debug */}
      {/* <pre>{JSON.stringify(form.batchStudents.map(s => s.studentName), null, 2)}</pre> */}
    </div>
  );
}

export default EditBatch;
