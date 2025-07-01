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
  FiInfo,
} from "react-icons/fi";
import { FaUserEdit, FaBirthdayCake } from "react-icons/fa";
import { type AttendanceType, type StudentsType } from "../types/index.types";

// Helpers
function getInitials(name?: string): string {
  return name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "S";
}

const formatDate = (date: string | Date | undefined) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getMonthYear = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
  });
};

// API
const fetchStudent = async (id?: string): Promise<StudentsType> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/getStudent/${id}`,
  );
  return data;
};

const fetchAttendanceById = async (id?: string): Promise<AttendanceType[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/attendance/student/${id}`,
  );
  return data;
};

// Components
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center bg-gray-50">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin text-5xl text-blue-600">
        <FiUser />
      </div>
      <p className="animate-pulse text-lg font-medium text-gray-600">
        Loading Student Information...
      </p>
    </div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="flex h-screen items-center justify-center bg-red-50 p-6 text-center">
    <div>
      <FiAlertTriangle className="mx-auto mb-4 text-5xl text-red-500" />
      <h2 className="text-2xl font-bold text-red-800">An Error Occurred</h2>
      <p className="mt-2 text-red-600">{message}</p>
    </div>
  </div>
);

const StudentProfileCard = ({ student }: { student: StudentsType }) => (
  <div className="rounded-2xl bg-white p-6 shadow-xl">
    <div className="flex items-start space-x-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-2xl font-bold text-white">
        {getInitials(student?.studentName)}
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-gray-800">
          {student.studentName}
        </h1>
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <FiMail /> {student.studentsEmail}
          </div>
          <div className="flex items-center gap-2">
            <FiPhone /> {student.studentsMobileNumber}
          </div>
        </div>
      </div>
      <Link to={`/editStudentInfoPage/${student._id}`} className="self-start">
        <button className="rounded-full bg-gray-100 p-3 text-gray-600 hover:bg-blue-100 hover:text-blue-600">
          <FaUserEdit size={20} />
        </button>
      </Link>
    </div>
  </div>
);

const StatCard = ({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) => (
  <div
    className={`flex items-center space-x-4 rounded-xl bg-white p-6 shadow-md ${color}`}
  >
    <div className="rounded-full bg-white p-3">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start space-x-4 py-2">
    <div className="mt-1 text-blue-500">{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-md font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const StudentDetails = ({ student }: { student: StudentsType }) => (
  <div className="rounded-2xl bg-white p-6 shadow-md">
    <div className="mb-4 flex items-center gap-2">
      <FiInfo className="text-xl text-blue-500" />
      <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <DetailItem
        icon={<FiCalendar />}
        label="Joining Date"
        value={formatDate(student.studentsJoiningDate)}
      />
      <DetailItem
        icon={<FiGitBranch />}
        label="Branch"
        value={student.studentsBranch}
      />
      <DetailItem
        icon={<FaBirthdayCake />}
        label="Age"
        value={`${student.studentsAge} years`}
      />
      <DetailItem
        icon={<FiAward />}
        label="Status"
        value={student.StudentsStatus}
      />
      <DetailItem
        icon={<FiMapPin />}
        label="Address"
        value={student.studentsAddress?.address}
      />
      <DetailItem
        icon={<FiUser />}
        label="Instrument"
        value={student.studentsInstruments}
      />
    </div>
  </div>
);

const AttendanceListItem = ({ record }: { record: AttendanceType }) => {
  const studentAttendance = record.attendanceRecord[0];
  const status = studentAttendance?.attendanceStatus;

  const statusMap = {
    Present: {
      icon: <FiCheckCircle />,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    Absent: { icon: <FiXCircle />, color: "text-red-500", bg: "bg-red-50" },
    Late: { icon: <FiClock />, color: "text-orange-500", bg: "bg-orange-50" },
  }[status] || {
    icon: <FiAlertTriangle />,
    color: "text-gray-500",
    bg: "bg-gray-50",
  };

  return (
    <li className="mb-2 flex items-center justify-between rounded-lg bg-white p-4 shadow-sm hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`rounded-full p-2 ${statusMap.bg} ${statusMap.color}`}>
          {statusMap.icon}
        </div>
        <div>
          <p className="font-semibold text-gray-800">
            {formatDate(record.attendanceDate)}
          </p>
          <p className={`text-sm font-medium ${statusMap.color}`}>{status}</p>
        </div>
      </div>
      <button className="rounded-md bg-blue-50 px-4 py-2 text-sm text-blue-600 hover:bg-blue-100">
        View Details
      </button>
    </li>
  );
};

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
  const absentCount = sortedAttendance.filter(
    (a) => a.attendanceRecord[0]?.attendanceStatus === "Absent",
  ).length;
  const lateCount = sortedAttendance.filter(
    (a) => a.attendanceRecord[0]?.attendanceStatus === "Late",
  ).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-2">
      <div className="mx-auto max-w-7xl">
        {studentData && <StudentProfileCard student={studentData} />}

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="grid gap-6 lg:col-span-1">
            <StatCard
              icon={<FiCheckCircle size={24} />}
              label="Present"
              value={presentCount}
              color="bg-green-100"
            />
            <StatCard
              icon={<FiXCircle size={24} />}
              label="Absent"
              value={absentCount}
              color="bg-red-100"
            />
            <StatCard
              icon={<FiClock size={24} />}
              label="Late"
              value={lateCount}
              color="bg-orange-100"
            />
          </div>
          <div className="lg:col-span-2">
            {studentData && <StudentDetails student={studentData} />}
          </div>
        </div>

        <div className="mt-10 rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center gap-2">
            <FiCalendar className="text-2xl text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">
              Attendance History
            </h2>
          </div>

          {Object.keys(groupedByMonth).length > 0 ? (
            Object.entries(groupedByMonth).map(([month, records]) => (
              <div key={month} className="mb-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-700">
                  {month}
                </h3>
                <ul>
                  {records.map((record) => (
                    <AttendanceListItem key={record._id} record={record} />
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FiAlertTriangle className="mb-4 text-4xl" />
              <p className="text-lg">
                No attendance records found for this student.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentsInformationPage;
