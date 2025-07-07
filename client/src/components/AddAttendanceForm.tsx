import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState, type ChangeEvent } from "react";
import { FiCalendar, FiTag, FiUsers, FiSearch } from "react-icons/fi";
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
  const [selectedInstrument, setSelectedInstrument] = useState("");

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

  const { data: ClassBatchResData } = useQuery<ClassBatchType[]>({
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
      toast.error("Please select a batch to submit attendance.");
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

  const getTitle = () => {
    if (selectedBatch) {
      return `Students in ${selectedBatch.batchName}`;
    }
    if (selectedInstrument) {
      return `Students for ${selectedInstrument}`;
    }
    return 'Students';
  };

  const studentList = (
    selectedBatch
      ? selectedBatch.batchStudents
      : allStudents.filter(
          (student) =>
            student.StudentsStatus === "Active" &&
            (!selectedInstrument ||
              student.studentsInstruments.includes(selectedInstrument)),
        )
  ).filter((student) =>
    student.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const searchResults = allStudents.filter(
    (student) =>
      student.StudentsStatus === "Active" &&
      student.studentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !studentList.some((s) => s._id === student._id) &&
      !addedStudents.some((s) => s._id === student._id),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Mark Attendance
            </h2>
            <p className="mt-2 text-indigo-100">
              Select an instrument and date to mark student attendance.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {/* Batch Selector */}
              <div>
                <label
                  htmlFor="batch"
                  className="flex items-center text-sm leading-6 font-semibold text-gray-900"
                >
                  <FiUsers className="mr-2 h-5 w-5 text-indigo-600" />
                  Batch
                </label>
                <div className="mt-2.5">
                  <select
                    id="batch"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
                    value={selectedBatch?._id || ""}
                    onChange={handleBatchChange}
                  >
                    <option value="">Select a batch</option>
                    {ClassBatchResData?.map((batch) => (
                      <option key={batch._id} value={batch._id}>
                        {batch.batchName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Instrument Selector */}
              <div>
                <label
                  htmlFor="instrument"
                  className="flex items-center text-sm leading-6 font-semibold text-gray-900"
                >
                  <FiTag className="mr-2 h-5 w-5 text-indigo-600" />
                  Instrument
                </label>
                <div className="mt-2.5">
                  <select
                    id="instrument"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
                    value={selectedInstrument}
                    onChange={(e) => setSelectedInstrument(e.target.value)}
                  >
                    <option value="">Select Instrument</option>
                    {[
                      ...new Set(
                        allStudents.flatMap((s) => s.studentsInstruments),
                      ),
                    ].map((instrument) => (
                      <option key={instrument} value={instrument}>
                        {instrument}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date Picker */}
              <div>
                <label
                  htmlFor="attendanceDate"
                  className="flex items-center text-sm leading-6 font-semibold text-gray-900"
                >
                  <FiCalendar className="mr-2 h-5 w-5 text-indigo-600" />
                  Date
                </label>
                <div className="mt-2.5">
                  <input
                    type="date"
                    id="attendanceDate"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Search Input */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="search"
                  className="flex items-center text-sm leading-6 font-semibold text-gray-900"
                >
                  <FiSearch className="mr-2 h-5 w-5 text-indigo-600" />
                  Search Student
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by name..."
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {searchResults.slice(0, 5).map((student) => (
                        <li
                          key={student._id}
                          className="relative cursor-default select-none py-2 px-3 text-gray-900 hover:bg-indigo-600 hover:text-white"
                          onClick={() => handleAddStudent(student)}
                        >
                          {student.studentName}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Remark Input */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="attendanceRemark"
                  className="flex items-center text-sm font-semibold leading-6 text-gray-900"
                >
                  <FiTag className="mr-2 h-5 w-5 text-indigo-600" />
                  Remark (Optional)
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    id="attendanceRemark"
                    placeholder="e.g., Special holiday class"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={attendanceRemark}
                    onChange={(e) => setAttendanceRemark(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Student List */}
            {(selectedBatch || selectedInstrument) && (
              <div className="mt-8">
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="flex items-center text-xl font-semibold text-gray-900">
                    <FiUsers className="mr-3 h-6 w-6 text-indigo-600" />
                    {getTitle()}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Mark the attendance status for each student.
                  </p>
                </div>
                <ul className="mt-6 space-y-4">
                  {[...studentList, ...addedStudents].map((student) => (
                    <li
                      key={student._id}
                      className="transform rounded-xl border border-gray-200 bg-white p-4 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <span className="text-lg font-medium text-gray-800">
                          {student.studentName}
                        </span>
                        <div className="flex items-center gap-2">
                          {(["Present", "Late", "Absent"] as const).map(
                            (status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  handleStatusChange(student._id, status)
                                }
                                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                                  attendanceStatusMap[student._id] === status
                                    ? {
                                        Present:
                                          "bg-emerald-500 text-white shadow-md",
                                        Late: "bg-amber-500 text-white shadow-md",
                                        Absent:
                                          "bg-red-500 text-white shadow-md",
                                      }[status]
                                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                              >
                                {status}
                              </button>
                            ),
                          )}
                          {addedStudents.some((s) => s._id === student._id) && (
                            <button
                              onClick={() => handleRemoveAddedStudent(student._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Submit Button */}
                <div className="mt-10 border-t border-gray-200 pt-6">
                  <button
                    className="w-full rounded-lg bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition-all duration-300 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
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
        </div>
      </div>
    </div>
  );
}

export default AddAttendanceForm;
