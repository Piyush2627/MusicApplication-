import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

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
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/attendance`,
  );
  return response.data.data;
};

const getStatusStyle = (status: string) => {
  const base = "rounded-full px-3 py-1 text-xs font-semibold";
  switch (status) {
    case "Present":
      return `${base} bg-green-100 text-green-800`;
    case "Absent":
      return `${base} bg-red-100 text-red-800`;
    case "Late":
      return `${base} bg-yellow-100 text-yellow-800`;
    default:
      return `${base} bg-gray-100 text-gray-800`;
  }
};

const AttendanceList: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["attendance"],
    queryFn: fetchAttendance,
  });

  if (isLoading) {
    return (
      <div className="w-full p-6 text-center text-gray-500">
        Loading attendance records...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-6 text-center text-red-600">
        Error loading attendance: {(error as Error).message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full p-6 text-center text-gray-500">
        No attendance records found.
      </div>
    );
  }

  const sortedData = [...data].sort(
    (a, b) =>
      new Date(b.attendanceDate).getTime() -
      new Date(a.attendanceDate).getTime(),
  );

  return (
    <div className="w-full max-w-3xl space-y-6">
      {sortedData.map((record) => (
        <div
          key={record._id}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Class: {record.attendanceOfClass}
            </h3>
            <p className="text-sm text-gray-600">
              Date:{" "}
              <span className="font-medium">
                {new Date(record.attendanceDate).toLocaleDateString()}
              </span>
            </p>
            {record.attendanceRemark && (
              <p className="text-sm text-gray-600">
                Remark:{" "}
                <span className="text-gray-700 italic">
                  {record.attendanceRemark}
                </span>
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs tracking-wide text-gray-500 uppercase">
                  <th className="px-4 py-2 text-left">Student</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {record.attendanceRecord.map((student, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="px-4 py-2">
                      {student.attendanceStudentsId?.studentName || "Unknown"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={getStatusStyle(student.attendanceStatus)}
                      >
                        {student.attendanceStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttendanceList;
