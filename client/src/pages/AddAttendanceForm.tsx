import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, type ChangeEvent } from "react";
import { type ClassBatchType, type StudentsType } from "../types/index.types";

function AddAttendanceForm() {
  const [selectedBatch, setSelectedBatch] = useState<ClassBatchType | null>(
    null,
  );
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceRemark, setAttendanceRemark] = useState("");
  const [attendanceStatusMap, setAttendanceStatusMap] = useState<{
    [studentId: string]: "Present" | "Absent" | "Late";
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [addedStudents, setAddedStudents] = useState<StudentsType[]>([]);

  const queryClient = useQueryClient();

  const fetchClassBatch = async () => {
    const res = await axios.get("/api/batches");
    return res.data;
  };

  const fetchAllStudents = async () => {
    const res = await axios.get("/api/getAllStudent"); // adjust path if needed
    return res.data;
  };

  const {
    data: ClassBatchResData,
    isLoading,
    isError,
  } = useQuery<ClassBatchType[]>({
    queryKey: ["classBatch"],
    queryFn: fetchClassBatch,
  });

  const { data: allStudents = [] } = useQuery<StudentsType[]>({
    queryKey: ["allStudents"],
    queryFn: fetchAllStudents,
  });

  const attendanceMutation = useMutation({
    mutationFn: async (payload: {
      attendanceDate: string;
      attendanceRemark: string;
      attendanceOfClass: string;
      attendanceRecord: {
        attendanceStudentsId: string;
        attendanceStatus: "Present" | "Absent" | "Late";
      }[];
    }) => {
      const res = await axios.post("/api/attendance", payload);
      return res.data;
    },
    onSuccess: () => {
      alert("Attendance submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (error) => {
      console.error("Error submitting attendance:", error);
      alert("Failed to submit attendance.");
    },
  });

  const handleBatchChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const batch = ClassBatchResData?.find((b) => b._id === selectedId) || null;
    setSelectedBatch(batch);
    setAddedStudents([]);

    const initialStatus: Record<string, "Present" | "Absent" | "Late"> = {};
    batch?.batchStudents.forEach((student: any) => {
      initialStatus[student._id] = "Absent";
    });
    setAttendanceStatusMap(initialStatus);
  };

  const handleStatusChange = (
    studentId: string,
    status: "Present" | "Absent" | "Late",
  ) => {
    setAttendanceStatusMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleAddStudent = (student: StudentsType) => {
    if (
      selectedBatch?.batchStudents.find((s) => s._id === student._id) ||
      addedStudents.find((s) => s._id === student._id)
    ) {
      return;
    }

    setAddedStudents((prev) => [...prev, student]);
    setAttendanceStatusMap((prev) => ({
      ...prev,
      [student._id]: "Absent",
    }));
  };

  const handleSubmitAttendance = () => {
    if (!selectedBatch) return;

    const attendanceRecord = Object.entries(attendanceStatusMap).map(
      ([studentId, status]) => ({
        attendanceStudentsId: studentId,
        attendanceStatus: status,
      }),
    );

    const payload = {
      attendanceDate: attendanceDate || new Date().toISOString(),
      attendanceRemark,
      attendanceOfClass: selectedBatch._id,
      attendanceRecord,
    };

    attendanceMutation.mutate(payload);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Mark Attendance</h2>
        <p className="mt-1 text-sm text-gray-500">
          Select a date and batch to begin.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Date
          </label>
          <input
            type="date"
            name="attendanceDate"
            className="block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Class Batch
          </label>
          {isLoading ? (
            <div className="h-10 w-full animate-pulse rounded-md bg-gray-200"></div>
          ) : isError ? (
            <p className="text-red-500">Error loading batches.</p>
          ) : (
            <select
              className="block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedBatch?._id || ""}
              onChange={handleBatchChange}
            >
              <option value="">Select a batch...</option>
              {ClassBatchResData?.map((ele) => (
                <option key={ele._id} value={ele._id}>
                  {ele.batchName} ({ele.batchBranch})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Remark (Optional)
          </label>
          <input
            type="text"
            name="attendanceRemark"
            placeholder="e.g., Special holiday class"
            className="block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={attendanceRemark}
            onChange={(e) => setAttendanceRemark(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-600">
            Add Extra Student
          </label>
          <input
            type="text"
            placeholder="Search student by name..."
            className="mb-2 block w-full rounded-md border border-gray-300 px-3 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <ul className="max-h-40 overflow-auto rounded-md border bg-white shadow">
              {allStudents
                .filter(
                  (student) =>
                    student.studentName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) &&
                    !selectedBatch?.batchStudents.some(
                      (s) => s._id === student._id,
                    ) &&
                    !addedStudents.some((s) => s._id === student._id),
                )
                .slice(0, 5)
                .map((student) => (
                  <li
                    key={student._id}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      handleAddStudent(student);
                      setSearchQuery("");
                    }}
                  >
                    {student.studentName}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {selectedBatch && (
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">
            Students in {selectedBatch.batchName}
          </h3>
          <ul className="space-y-3">
            {[...selectedBatch.batchStudents, ...addedStudents].map(
              (student) => (
                <li
                  key={student._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-50 p-3"
                >
                  <span className="font-medium text-gray-800">
                    {student.studentName}
                  </span>
                  <div className="flex items-center gap-2">
                    {(["Present", "Late", "Absent"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(student._id, status)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200 ${
                          attendanceStatusMap[student._id] === status
                            ? {
                                Present: "bg-emerald-500 text-white shadow",
                                Late: "bg-amber-500 text-white shadow",
                                Absent: "bg-red-500 text-white shadow",
                              }[status]
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </li>
              ),
            )}
          </ul>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <button
              className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              onClick={handleSubmitAttendance}
              disabled={attendanceMutation.isPending}
            >
              {attendanceMutation.isPending
                ? "Submitting..."
                : "Submit Attendance"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddAttendanceForm;
