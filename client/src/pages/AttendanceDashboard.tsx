import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import AddAttendanceModal from "../components/AddAttendanceModal";
import AddAttendanceForm from "./AddAttendanceForm";

// === Types ===
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

interface Batch {
  _id: string;
  batchName: string;
}

// === Fetchers with correct return types ===
const fetchAttendance = async (): Promise<AttendanceRecord[]> => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/attendance`,
    );
    return res.data.data;
  } catch (error) {
    toast.error("Failed to fetch attendance records.");
    return [];
  }
};

const fetchBatches = async (): Promise<Batch[]> => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/batches`,
    );
    return res.data.data;
  } catch (error) {
    toast.error("Failed to fetch batches.");
    return [];
  }
};

// === Helpers ===
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
  return date.toLocaleString("default", { day: "numeric", month: "short" });
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

const AttendanceDashboard: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: attendance = [],
    isLoading: loadingAttendance,
    refetch: refetchAttendance,
  } = useQuery<AttendanceRecord[], Error>({
    queryKey: ["attendance"],
    queryFn: fetchAttendance,
  });

  const { data: batches = [], isLoading: loadingBatches } = useQuery<
    Batch[],
    Error
  >({
    queryKey: ["batches"],
    queryFn: fetchBatches,
  });

  useEffect(() => {
    setExpanded({});
  }, [selectedBatch]);

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const filtered = selectedBatch
    ? attendance.filter((r) => r.attendanceOfClass === selectedBatch)
    : attendance;

  const grouped: Record<string, AttendanceRecord[]> = filtered.reduce(
    (acc: Record<string, AttendanceRecord[]>, rec: AttendanceRecord) => {
      const month = new Date(rec.attendanceDate).toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      if (!acc[month]) acc[month] = [];
      acc[month].push(rec);
      return acc;
    },
    {},
  );

  if (loadingAttendance || loadingBatches) {
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <select
          className="rounded border px-3 py-2 text-sm"
          value={selectedBatch || ""}
          onChange={(e) => setSelectedBatch(e.target.value || null)}
        >
          <option value="">All Batches</option>
          {batches.map((b: Batch) => (
            <option key={b._id} value={b._id}>
              {b.batchName}
            </option>
          ))}
        </select>

        <button
          onClick={() => setModalOpen(true)}
          className="rounded bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          ➕ Add Attendance
        </button>
      </div>
      <AddAttendanceForm />
      <AddAttendanceModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          refetchAttendance();
        }}
      />

      {/* Grouped Attendance */}
      {Object.keys(grouped).length > 0 ? (
        Object.entries(grouped).map(([month, records]) => {
          const sorted = [...records].sort(
            (a, b) =>
              new Date(b.attendanceDate).getTime() -
              new Date(a.attendanceDate).getTime(),
          );

          return (
            <div key={month}>
              <h3 className="mt-6 text-xl font-semibold text-gray-800">
                {month}
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {sorted.map((rec: AttendanceRecord) => (
                  <div
                    key={rec._id}
                    className="rounded border bg-gray-50 p-3 shadow-sm"
                  >
                    <div
                      className="flex cursor-pointer items-start justify-between"
                      onClick={() => toggle(rec._id)}
                    >
                      <div>
                        <div className="text-lg font-semibold">
                          {formatDay(rec.attendanceDate)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {rec.attendanceRemark || "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {getSummaryIcon(rec)} Attendance
                        </div>
                      </div>
                      <div className="pt-1">
                        {expanded[rec._id] ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </div>
                    </div>

                    {expanded[rec._id] && (
                      <div className="mt-3 max-h-40 overflow-y-auto rounded border bg-white p-2 text-xs shadow-inner">
                        <div className="mb-2 font-medium text-gray-600">
                          {formatFullDate(rec.attendanceDate)}
                        </div>
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b text-left text-gray-500">
                              <th className="pb-1">Student</th>
                              <th className="pb-1">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rec.attendanceRecord.map(
                              (student: AttendanceStudent, i: number) => (
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
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      ) : (
        <div className="mt-10 text-center text-gray-500">
          No attendance records found.
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;
