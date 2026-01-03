import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import {
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiFilter,
  FiPlus,
  FiUsers,
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import AddAttendanceModal from "../components/AddAttendanceModal";

// --- Types ---
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

// --- API Functions ---
const fetchAttendance = async (): Promise<AttendanceRecord[]> => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/attendance`,
    );
    return res.data.data;
  } catch (error) {
    toast.error("Failed to fetch attendance records.");
    return [];
  }
};

const fetchBatches = async (): Promise<Batch[]> => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/batches`);
    return res.data.data;
  } catch (error) {
    toast.error("Failed to fetch batches.");
    return [];
  }
};

// --- Helper Components ---

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Present: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Absent: "bg-rose-100 text-rose-700 border-rose-200",
    Late: "bg-amber-100 text-amber-700 border-amber-200",
    default: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const activeStyle = styles[status as keyof typeof styles] || styles.default;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${activeStyle}`}
    >
      {status}
    </span>
  );
};

const SkeletonCard = () => (
  <div className="animate-pulse rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-lg bg-gray-200"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        <div className="h-3 w-1/3 rounded bg-gray-200"></div>
      </div>
    </div>
  </div>
);

// --- Main Component ---

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

  // Filter Logic
  const filtered = selectedBatch
    ? attendance.filter((r) => r.attendanceOfClass === selectedBatch)
    : attendance;

  // Grouping Logic
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

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans text-gray-800">
      <Toaster position="top-right" />

      {/* --- Header Section --- */}
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Attendance Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage daily attendance records and track student status.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Filter Dropdown */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FiFilter />
              </div>
              <select
                className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white pr-8 pl-10 text-sm font-medium text-gray-700 shadow-sm transition hover:border-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none sm:w-48"
                value={selectedBatch || ""}
                onChange={(e) => setSelectedBatch(e.target.value || null)}
              >
                <option value="">All Batches</option>
                {batches.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.batchName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                <FiChevronDown className="h-4 w-4" />
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setModalOpen(true)}
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:outline-none"
            >
              <FiPlus className="h-4 w-4" />
              <span>Record Attendance</span>
            </button>
          </div>
        </div>

        <AddAttendanceModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            refetchAttendance();
          }}
        />

        {/* --- Content Section --- */}
        {loadingAttendance || loadingBatches ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : Object.keys(grouped).length > 0 ? (
          <div className="space-y-10">
            {Object.entries(grouped)
              .reverse()
              .map(([month, records]) => {
                const sorted = [...records].sort(
                  (a, b) =>
                    new Date(b.attendanceDate).getTime() -
                    new Date(a.attendanceDate).getTime(),
                );

                return (
                  <div
                    key={month}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  >
                    <div className="mb-4 flex items-center gap-2">
                      <FiCalendar className="text-violet-500" />
                      <h3 className="text-lg font-bold text-gray-800">
                        {month}
                      </h3>
                      <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                        {records.length} Records
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {sorted.map((rec) => {
                        const dateObj = new Date(rec.attendanceDate);
                        const day = dateObj.getDate();
                        const weekday = dateObj.toLocaleString("default", {
                          weekday: "short",
                        });
                        const isExpanded = expanded[rec._id];

                        return (
                          <div
                            key={rec._id}
                            className={`group flex flex-col rounded-xl border bg-white shadow-sm transition-all hover:shadow-md ${
                              isExpanded
                                ? "ring-2 ring-violet-500 ring-offset-1"
                                : "border-gray-200"
                            }`}
                          >
                            {/* Card Header */}
                            <div
                              className="flex cursor-pointer items-start gap-4 p-4"
                              onClick={() => toggle(rec._id)}
                            >
                              {/* Date Box */}
                              <div className="flex flex-col items-center justify-center rounded-lg bg-violet-50 px-3 py-2 text-violet-700 shadow-sm">
                                <span className="text-xs font-bold tracking-wider uppercase">
                                  {weekday}
                                </span>
                                <span className="text-xl leading-none font-bold">
                                  {day}
                                </span>
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-gray-900">
                                    {/* Try to find batch name if possible, or show 'Class Record' */}
                                    Class Record
                                  </span>
                                  {isExpanded ? (
                                    <FiChevronUp className="text-violet-500" />
                                  ) : (
                                    <FiChevronDown className="text-gray-400 group-hover:text-gray-600" />
                                  )}
                                </div>
                                <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                                  {rec.attendanceRemark ||
                                    "No remarks provided"}
                                </p>
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                                  <FiUsers className="h-3 w-3" />
                                  <span>
                                    {rec.attendanceRecord.length} Students
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="border-t border-gray-100 bg-gray-50/50 p-3">
                                <div className="scrollbar-thin scrollbar-thumb-gray-300 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-inner">
                                  <table className="w-full text-left text-xs">
                                    <thead className="sticky top-0 bg-gray-100 font-semibold text-gray-600">
                                      <tr>
                                        <th className="px-3 py-2">Student</th>
                                        <th className="px-3 py-2 text-right">
                                          Status
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                      {rec.attendanceRecord.map(
                                        (student, i) => (
                                          <tr
                                            key={i}
                                            className="hover:bg-gray-50"
                                          >
                                            <td className="px-3 py-2 text-gray-700">
                                              {student.attendanceStudentsId
                                                ?.studentName || "Unknown"}
                                            </td>
                                            <td className="px-3 py-2 text-right">
                                              <StatusBadge
                                                status={
                                                  student.attendanceStatus
                                                }
                                              />
                                            </td>
                                          </tr>
                                        ),
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          /* Empty State */
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 text-center">
            <div className="rounded-full bg-gray-100 p-4">
              <FiCalendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No records found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedBatch
                ? "There are no attendance records for this batch."
                : "Get started by adding a new attendance record."}
            </p>
            {!selectedBatch && (
              <button
                onClick={() => setModalOpen(true)}
                className="mt-6 text-sm font-semibold text-violet-600 hover:text-violet-500 hover:underline"
              >
                Create your first record &rarr;
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceDashboard;
