import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { type AttendanceType, type StudentsType } from "../types/index.types";
import { FiUser, FiCalendar, FiAlertTriangle } from "react-icons/fi";
import { FaUserEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

function getInitials(name?: string) {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "S";
}

function StudentsInformationPage() {
  const { studentsId } = useParams();

  const fetchStudent = async (): Promise<StudentsType> => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/getStudent/${studentsId}`,
    );
    return data;
  };

  const fetchAttendanceById = async (): Promise<AttendanceType[]> => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/attendance/student/${studentsId}`,
    );
    return data;
  };

  const {
    data: studentsData,
    error,
    isLoading,
  } = useQuery<StudentsType>({
    queryKey: ["students", studentsId],
    queryFn: fetchStudent,
    enabled: !!studentsId,
  });

  const { data: attendanceData, isLoading: isAttendanceLoading } = useQuery<
    AttendanceType[]
  >({
    queryKey: ["attendance", studentsId],
    queryFn: fetchAttendanceById,
    enabled: !!studentsId,
  });

  if (isLoading || isAttendanceLoading) {
    return (
      <div className="flex h-52 items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <span className="animate-spin text-4xl text-blue-500">
            <FiUser />
          </span>
          <span className="animate-pulse text-gray-500">
            Loading student info...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <FiAlertTriangle className="mb-2 text-3xl text-red-500" />
        <span className="font-semibold text-red-700">
          Failed to load student information. Please try again later.
        </span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="w-full rounded-lg bg-white p-6 shadow-md">
        <div className="mb-5 flex items-center space-x-4 pb-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700 shadow">
            {getInitials(studentsData?.studentName)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {studentsData?.studentName || "Student Name Unavailable"}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Student ID: <span className="font-mono">{studentsId}</span>
            </p>
          </div>
          <div>
            <Link to={`/editStudentInfoPage/${studentsData?._id}`}>
              <button className="rounded border border-blue-100 px-3 py-1 text-xs font-medium text-blue-600 shadow-sm hover:bg-blue-50">
                <FaUserEdit className="size-6" />
              </button>
            </Link>
          </div>
        </div>

        <section>
          <div className="sticky top-0 z-10 -mx-6 flex items-center space-x-2 border-b bg-white/90 px-6 py-3">
            <FiCalendar className="text-lg text-blue-500" />
            <h2 className="text-lg font-semibold sm:text-xl">
              Attendance Records
            </h2>
          </div>
          {attendanceData && attendanceData.length > 0 ? (
            <ul className="divide-y">
              {attendanceData.map((record, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-4 transition hover:bg-gray-50"
                >
                  <span className="flex items-center space-x-2 text-gray-700">
                    <FiCalendar className="text-blue-400" />
                    <span>
                      {new Date(record.attendanceDate).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </span>
                  <button className="rounded border border-blue-100 px-3 py-1 text-xs font-medium text-blue-600 shadow-sm hover:bg-blue-50">
                    View Log
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <FiAlertTriangle className="mb-2 text-xl" />
              <span>No attendance records found.</span>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default StudentsInformationPage;
