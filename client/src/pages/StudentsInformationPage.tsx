import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  FiUser,
  FiCalendar,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGitBranch,
  FiAward,
  FiTrendingUp,
  FiEdit3,
} from "react-icons/fi";
import { FaBirthdayCake } from "react-icons/fa";
import { type AttendanceType, type StudentsType } from "../types/index.types";

// --- Helpers ---
function getInitials(name?: string): string {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "ST";
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getMonthYear = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
  });
};

// --- API ---
const fetchStudent = async (id?: string): Promise<StudentsType> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/getStudent/${id}`,
  );
  return data.data;
};

const fetchAttendanceById = async (id?: string): Promise<AttendanceType[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/attendance/student/${id}`,
  );
  return data.data;
};
// --- Sub-Components ---

const LoadingSpinner = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
      <div className="absolute h-16 w-16 animate-ping rounded-full bg-indigo-100 opacity-75"></div>
      <FiUser className="animate-pulse text-2xl text-indigo-600" />
    </div>
    <p className="font-medium text-slate-500">Loading student profile...</p>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex min-h-[60vh] items-center justify-center p-6">
    <div className="w-full max-w-md rounded-xl border border-red-100 bg-red-50 p-8 text-center shadow-sm">
      <FiAlertTriangle className="mx-auto mb-4 text-4xl text-red-500" />
      <h2 className="text-xl font-bold text-red-900">Unable to load data</h2>
      <p className="mt-2 text-sm text-red-700">{message}</p>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Present: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Absent: "bg-rose-100 text-rose-700 border-rose-200",
    Late: "bg-amber-100 text-amber-700 border-amber-200",
  };

  // Cast the key, falling back if the data from API doesn't match
  const activeClass =
    styles[status as keyof typeof styles] ||
    "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${activeClass}`}
    >
      {status}
    </span>
  );
};

const StatCard = ({
  label,
  value,
  subtext,
  icon,
  colorClass,
}: {
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  colorClass: string;
}) => (
  <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
        {subtext && <p className="mt-1 text-xs text-slate-400">{subtext}</p>}
      </div>
      <div className={`rounded-xl p-3 ${colorClass}`}>{icon}</div>
    </div>
  </div>
);

const DetailRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center gap-4 border-b border-slate-50 py-3 last:border-0">
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-indigo-500">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
        {label}
      </p>
      <p className="font-medium text-slate-700">{value || "—"}</p>
    </div>
  </div>
);

// --- Main Page Component ---

function StudentsInformationPage() {
  const { studentsId } = useParams<{ studentsId: string }>();

  const {
    data: studentData,
    isLoading: isStudentLoading,
    error: studentError,
  } = useQuery({
    queryKey: ["student", studentsId],
    queryFn: () => fetchStudent(studentsId),
    enabled: !!studentsId,
  });

  const { data: attendanceData, isLoading: isAttendanceLoading } = useQuery({
    queryKey: ["attendance", studentsId],
    queryFn: () => fetchAttendanceById(studentsId),
    enabled: !!studentsId,
  });

  if (isStudentLoading || isAttendanceLoading) return <LoadingSpinner />;
  if (studentError) return <ErrorDisplay message={studentError.message} />;

  // --- Logic & Computations ---
  const sortedAttendance = [...(attendanceData || [])].sort(
    (a, b) =>
      new Date(b.attendanceDate).getTime() -
      new Date(a.attendanceDate).getTime(),
  );

  const groupedByMonth: Record<string, AttendanceType[]> = {};
  sortedAttendance.forEach((record) => {
    const key = getMonthYear(record.attendanceDate);
    groupedByMonth[key] = groupedByMonth[key] || [];
    groupedByMonth[key].push(record);
  });

  const presentCount = sortedAttendance.filter(
    (a) => a.attendanceRecord[0]?.attendanceStatus === "Present",
  ).length;
  const totalClasses = sortedAttendance.length;
  const attendanceRate = totalClasses
    ? Math.round((presentCount / totalClasses) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12 font-sans text-slate-900">
      {/* 1. Header Section with Cover */}
      <div className="bg-white shadow-sm">
        {/* Cover Gradient */}
        <div className="h-32 w-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-12 flex flex-col items-center pb-6 sm:flex-row sm:items-end sm:space-x-6">
            {/* Avatar */}
            <div className="relative h-24 w-24 rounded-full border-4 border-white bg-slate-200 shadow-md sm:h-32 sm:w-32">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-800 text-3xl font-bold text-white">
                {getInitials(studentData?.studentName)}
              </div>
            </div>

            {/* Name & Basic Info */}
            <div className="mt-4 flex-1 text-center sm:mt-0 sm:pb-1 sm:text-left">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                {studentData?.studentName}
              </h1>
              <div className="mt-1 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <FiMail className="text-slate-400" />{" "}
                  {studentData?.studentsEmail}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiPhone className="text-slate-400" />{" "}
                  {studentData?.studentsMobileNumber}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <div className="mt-4 sm:mt-0">
              <Link to={`/admin/editStudentInfoPage/${studentData?._id}`}>
                <button className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <FiEdit3 /> Edit Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* 2. Left Column: Stats & Details */}
          <div className="space-y-8 lg:col-span-1">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <StatCard
                  label="Attendance Rate"
                  value={`${attendanceRate}%`}
                  subtext="Overall performance"
                  icon={<FiTrendingUp className="text-xl text-white" />}
                  colorClass={
                    attendanceRate > 75 ? "bg-emerald-500" : "bg-amber-500"
                  }
                />
              </div>
              <StatCard
                label="Present"
                value={presentCount}
                icon={<FiCheckCircle className="text-xl text-emerald-600" />}
                colorClass="bg-emerald-100"
              />
              <StatCard
                label="Absent"
                value={sortedAttendance.length - presentCount}
                icon={<FiXCircle className="text-xl text-rose-600" />}
                colorClass="bg-rose-100"
              />
            </div>

            {/* Details Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="mb-4 text-lg font-bold text-slate-800">
                Student Details
              </h3>
              {studentData && (
                <div className="flex flex-col">
                  <DetailRow
                    icon={<FiAward />}
                    label="Status"
                    value={<StatusBadge status={studentData.StudentsStatus} />}
                  />
                  <DetailRow
                    icon={<FiGitBranch />}
                    label="Branch"
                    value={studentData.studentsBranch}
                  />
                  <DetailRow
                    icon={<FiUser />}
                    label="Instrument"
                    value={studentData.studentsInstruments}
                  />
                  <DetailRow
                    icon={<FiCalendar />}
                    label="Joined"
                    value={formatDate(studentData.studentsJoiningDate)}
                  />
                  <DetailRow
                    icon={<FaBirthdayCake />}
                    label="Age"
                    value={`${studentData.studentsAge} years`}
                  />
                  <DetailRow
                    icon={<FiMapPin />}
                    label="Address"
                    value={studentData.studentsAddress?.address}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 3. Right Column: Timeline History */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                  Attendance History
                </h3>
                <span className="text-sm text-slate-500">
                  {totalClasses} Records found
                </span>
              </div>
              <div className="h-96 overflow-x-auto">
                {Object.keys(groupedByMonth).length > 0 ? (
                  <div className="space-y-8">
                    {Object.entries(groupedByMonth).map(([month, records]) => (
                      <div key={month} className="relative">
                        <div className="sticky top-0 z-10 mb-4 bg-white/95 py-2 backdrop-blur-sm">
                          <h4 className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                            <FiCalendar className="mr-2" /> {month}
                          </h4>
                        </div>

                        {/* Timeline Container */}
                        <div className="relative ml-3 space-y-6 border-l-2 border-slate-100 pb-4 pl-6">
                          {records.map((record) => {
                            const studentAtt = record.attendanceRecord[0];
                            const status =
                              studentAtt?.attendanceStatus || "Absent";

                            return (
                              <div key={record._id} className="group relative">
                                {/* Timeline Dot */}
                                <div
                                  className={`absolute -left-[31px] mt-1.5 h-4 w-4 rounded-full border-2 border-white ring-1 ${
                                    status === "Present"
                                      ? "bg-emerald-500 ring-emerald-200"
                                      : status === "Late"
                                        ? "bg-amber-500 ring-amber-200"
                                        : "bg-rose-500 ring-rose-200"
                                  }`}
                                ></div>

                                <div className="flex flex-col rounded-lg border border-slate-100 bg-slate-50/50 p-4 transition hover:border-indigo-200 hover:bg-white hover:shadow-sm sm:flex-row sm:items-center sm:justify-between">
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-700">
                                      {formatDate(record.attendanceDate)}
                                    </span>
                                    <span className="text-xs text-slate-500">
                                      {new Date(
                                        record.attendanceDate,
                                      ).toLocaleDateString("en-IN", {
                                        weekday: "long",
                                      })}
                                    </span>
                                  </div>

                                  <div className="mt-2 flex items-center gap-4 sm:mt-0">
                                    <StatusBadge status={status} />
                                    {status === "Late" && (
                                      <FiClock className="text-amber-500" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <div className="rounded-full bg-slate-50 p-4">
                      <FiCalendar className="text-4xl" />
                    </div>
                    <p className="mt-2 text-sm">
                      No attendance records found yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentsInformationPage;
