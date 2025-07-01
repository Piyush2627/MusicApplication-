import AddAttendanceModal from "../components/AddAttendanceModal";
import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface AttendanceStudent {
  attendanceStudentsId: {
    _id: string;
    studentName: string;
  };
  attendanceStatus: "Present" | "Absent" | "Late";
}

interface AttendanceRecord {
  _id: string;
  attendanceDate: string;
  attendanceRemark?: string;
  attendanceOfClass: string;
  attendanceRecord: AttendanceStudent[];
}

const fetchAttendance = async (): Promise<AttendanceRecord[]> => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/attendance`,
  );
  return res.data.data;
};

const getSummaryIcon = (record: AttendanceRecord) => {
  const total = record.attendanceRecord.length;
  const present = record.attendanceRecord.filter(
    (s) => s.attendanceStatus === "Present",
  ).length;
  const absent = record.attendanceRecord.filter(
    (s) => s.attendanceStatus === "Absent",
  ).length;

  if (present === total) return "🟢";
  if (absent === total) return "🔴";
  return "🟡";
};

const getStatusStyle = (status: string) => {
  const base = "rounded-full px-2 py-0.5 text-xs font-semibold";
  switch (status) {
    case "Present":
      return `${base} bg-green-100 text-green-700`;
    case "Absent":
      return `${base} bg-red-100 text-red-700`;
    case "Late":
      return `${base} bg-yellow-100 text-yellow-700`;
    default:
      return `${base} bg-gray-100 text-gray-700`;
  }
};

const formatDay = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString("default", { day: "numeric" });
};

const formatFullDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("default", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const AttendanceDashboard: React.FC = () => {
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>(
    {},
  );
  // adjust path
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: attendance, isLoading } = useQuery({
    queryKey: ["attendance"],
    queryFn: fetchAttendance,
  });

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading attendance records...
      </div>
    );
  }

  // Group by Batch → Month → Dates
  const grouped: Record<string, Record<string, AttendanceRecord[]>> = {};

  attendance?.forEach((record) => {
    const batch = record.attendanceOfClass;
    const month = new Date(record.attendanceDate).toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!grouped[batch]) grouped[batch] = {};
    if (!grouped[batch][month]) grouped[batch][month] = [];

    grouped[batch][month].push(record);
  });

  // Sort months DESC (latest month first)
  const sortMonthsDesc = (months: string[]) =>
    months.sort((a, b) => {
      const da = new Date(`1 ${a}`); // "1 July 2025"
      const db = new Date(`1 ${b}`);
      return db.getTime() - da.getTime();
    });

  const toggleExpand = (recordId: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  return (
    <div className="space-y-10">
      <div className="p-6">
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
          >
            ➕ Add Attendance
          </button>
        </div>

        {/* Your main attendance content here */}

        <AddAttendanceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
      {Object.entries(grouped).map(([batchName, months]) => (
        <div
          key={batchName}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <h2 className="mb-4 text-2xl font-bold text-indigo-700">
            🎓 Batch: {batchName}
          </h2>

          {sortMonthsDesc(Object.keys(months)).map((month) => {
            const records = months[month];
            return (
              <div key={month} className="mb-8">
                <h3 className="mb-3 border-b pb-1 text-lg font-semibold text-gray-800">
                  {month}
                </h3>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {records.map((record) => (
                    <div
                      key={record._id}
                      className="cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-3 shadow-sm transition-all hover:shadow-md"
                    >
                      <div
                        className="flex items-center justify-between"
                        onClick={() => toggleExpand(record._id)}
                      >
                        <div>
                          <div className="text-md font-semibold text-gray-800">
                            {formatDay(record.attendanceDate)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getSummaryIcon(record)} Attendance
                          </div>
                        </div>
                        <div>
                          {expandedDates[record._id] ? (
                            <FiChevronUp className="text-gray-400" />
                          ) : (
                            <FiChevronDown className="text-gray-400" />
                          )}
                        </div>
                      </div>

                      {expandedDates[record._id] && (
                        <div className="mt-3 max-h-40 overflow-y-auto rounded bg-white p-2 text-xs shadow-inner">
                          <div className="mb-2 font-medium text-gray-600">
                            {formatFullDate(record.attendanceDate)}
                          </div>
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="border-b text-left text-gray-500">
                                <th className="pb-1">Student</th>
                                <th className="pb-1">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {record.attendanceRecord.map((student, i) => (
                                <tr key={i} className="border-t text-gray-700">
                                  <td className="py-1 pr-2">
                                    {student.attendanceStudentsId
                                      ?.studentName || "Unknown"}
                                  </td>
                                  <td className="py-1">
                                    <span
                                      className={getStatusStyle(
                                        student.attendanceStatus,
                                      )}
                                    >
                                      {student.attendanceStatus}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default AttendanceDashboard;
