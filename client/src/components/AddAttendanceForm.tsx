import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, type ChangeEvent } from "react";
import {
  FiCalendar,
  FiTag,
  FiUsers,
  FiSearch,
  FiPlus,
  FiX,
} from "react-icons/fi";
import toast from "react-hot-toast";
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
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/batches`,
    );
    return res.data;
  };

  const fetchAllStudents = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/getAllStudent`,
    ); // adjust path if needed
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
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/attendance`,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Attendance submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      // Reset form after successful submission
      setSelectedBatch(null);
      setAttendanceDate("");
      setAttendanceRemark("");
      setAttendanceStatusMap({});
      setAddedStudents([]);
      setSearchQuery("");
    },
    onError: (error) => {
      console.error("Error submitting attendance:", error);
      toast.error("Failed to submit attendance.");
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
      toast.error("Student already in batch or added.");
      return;
    }

    setAddedStudents((prev) => [...prev, student]);
    setAttendanceStatusMap((prev) => ({
      ...prev,
      [student._id]: "Absent",
    }));
  };

  const handleRemoveAddedStudent = (studentId: string) => {
    setAddedStudents((prev) => prev.filter((s) => s._id !== studentId));
    setAttendanceStatusMap((prev) => {
      const newMap = { ...prev };
      delete newMap[studentId];
      return newMap;
    });
  };

  const handleSubmitAttendance = () => {
    if (!selectedBatch) {
      toast.error("Please select a batch.");
      return;
    }
    if (Object.keys(attendanceStatusMap).length === 0) {
      toast.error("Please mark attendance for at least one student.");
      return;
    }

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
          <label
            htmlFor="attendanceDate"
            className="mb-2 flex items-center text-sm font-medium text-gray-600"
          >
            <FiCalendar className="mr-2" /> Date
          </label>
          <input
            type="date"
            id="attendanceDate"
            name="attendanceDate"
            className="block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="classBatch"
            className="mb-2 flex items-center text-sm font-medium text-gray-600"
          >
            <FiUsers className="mr-2" /> Class Batch
          </label>
          {isLoading ? (
            <div className="h-10 w-full animate-pulse rounded-md bg-gray-200"></div>
          ) : isError ? (
            <p className="text-red-500">Error loading batches.</p>
          ) : (
            <select
              id="classBatch"
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
          <label
            htmlFor="attendanceRemark"
            className="mb-2 flex items-center text-sm font-medium text-gray-600"
          >
            <FiTag className="mr-2" /> Remark (Optional)
          </label>
          <input
            type="text"
            id="attendanceRemark"
            name="attendanceRemark"
            placeholder="e.g., Special holiday class"
            className="block w-full rounded-md border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={attendanceRemark}
            onChange={(e) => setAttendanceRemark(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="addStudent"
            className="mb-2 flex items-center text-sm font-medium text-gray-600"
          >
            <FiPlus className="mr-2" /> Add Extra Student
          </label>
          <div className="relative">
            <input
              type="text"
              id="addStudent"
              placeholder="Search student by name..."
              className="block w-full rounded-md border border-gray-300 px-3 py-2 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          </div>
          {searchQuery && (
            <ul className="mt-2 max-h-40 overflow-auto rounded-md border bg-white shadow">
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
                    className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      handleAddStudent(student);
                      setSearchQuery("");
                    }}
                  >
                    {student.studentName}
                    <FiPlus className="text-green-500" />
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {selectedBatch && (
        <div>
          <h3 className="mb-4 flex items-center border-b pb-2 text-lg font-semibold text-gray-700">
            <FiUsers className="mr-2" /> Students in {selectedBatch.batchName}
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
                    {addedStudents.some((s) => s._id === student._id) && (
                      <button
                        onClick={() => handleRemoveAddedStudent(student._id)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Remove student"
                      >
                        <FiX size={18} />
                      </button>
                    )}
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
