import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { type ClassBatchType, type StudentsType } from "../types/index.types";
import { useEffect, useState, useMemo, type JSX, memo } from "react";
import {
  FaUsers,
  FaExclamationTriangle,
  FaLayerGroup,
  FaPlusCircle,
  FaUserSlash,
  FaQuestionCircle,
  FaUserPlus,
  FaSearch,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import StudentsDataTable from "../components/common/StudentsDataTable";

// --- API Fetching Functions ---
const fetchStudents = async (): Promise<StudentsType[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/getAllStudent`,
  );
  return data;
};

const fetchBatches = async (): Promise<ClassBatchType[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/batches`,
  );
  return data;
};

interface Enquiry {
  _id: string;
  studentName: string;
  instrument: string;
  createdAt: string;
}

const fetchEnquiries = async (): Promise<Enquiry[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/enquiries`,
  );
  return data.data || [];
};

// --- Main Dashboard Page Component ---
function StudentsDashboardPage() {
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // --- Data Fetching ---
  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useQuery<StudentsType[], Error>({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  const { data: classBatch } = useQuery<ClassBatchType[]>({
    queryKey: ["batches"],
    queryFn: fetchBatches,
  });
  const { data: enquiries } = useQuery<Enquiry[]>({
    queryKey: ["enquiries"],
    queryFn: fetchEnquiries,
  });

  // --- Derived State with useMemo for Performance ---
  const availableCities = useMemo(() => {
    if (!students) return [];
    const cities = new Set<string>();
    students.forEach((student) => {
      const country = student?.studentsAddress?.country ?? "";
      const city = student?.studentsAddress?.city ?? "";
      if (
        city &&
        (!selectedCountry ||
          country.toLowerCase() === selectedCountry.toLowerCase())
      ) {
        cities.add(city);
      }
    });
    return Array.from(cities).sort();
  }, [students, selectedCountry]);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter((student) => {
      const name = student?.studentName ?? "";
      const country = student?.studentsAddress?.country ?? "";
      const city = student?.studentsAddress?.city ?? "";
      const nameMatch = name
        .toLowerCase()
        .includes(studentSearch.toLowerCase());
      const countryMatch =
        !selectedCountry ||
        country.toLowerCase() === selectedCountry.toLowerCase();
      const cityMatch =
        !selectedCity || city.toLowerCase() === selectedCity.toLowerCase();
      return nameMatch && countryMatch && cityMatch;
    });
  }, [students, studentSearch, selectedCountry, selectedCity]);

  useEffect(() => {
    setSelectedCity("");
  }, [selectedCountry]);

  // --- Render Logic ---
  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-red-50 text-red-700">
        <FaExclamationTriangle className="mb-4 h-16 w-16" />
        <h2 className="mb-2 text-2xl font-bold">Failed to load data</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50/50">
      <div className="container mx-auto px-4 py-6">
        {/* Hero Section */}
        <div className="relative mb-6 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 p-6 text-white shadow-lg">
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Student Dashboard
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-indigo-200">
                  Managing <strong>{students?.length ?? 0}</strong> students
                  across <strong>{classBatch?.length ?? 0}</strong> batches.
                </p>
              </div>
              <div className="mt-4 flex shrink-0 flex-col gap-2 sm:flex-row md:mt-0">
                <QuickActionLink
                  to="/admin/add-students"
                  icon={<FaUserPlus />}
                  label="Add Student"
                />
                <QuickActionLink
                  to="/admin/batch"
                  icon={<FaPlusCircle />}
                  label="New Batch"
                />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 -mb-12 ml-4 h-24 w-24 rounded-full bg-white/10" />
        </div>

        {/* Stat Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            title="Total Students"
            value={students?.length ?? 0}
            icon={<FaUsers />}
            color="indigo"
            className="h-full"
          />
          <Card
            title="Total Batches"
            value={classBatch?.length ?? 0}
            icon={<FaLayerGroup />}
            color="teal"
            className="h-full"
          />
          <Card
            title="Inactive"
            value={
              students?.filter((ele) => ele.StudentsStatus === "Inactive")
                .length ?? 0
            }
            icon={<FaUserSlash />}
            color="yellow"
            className="h-full"
          />
          <RecentEnquiries enquiries={enquiries} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            <SidebarQuickActions />
            <StudentDistributionChart students={students} />
          </div>

          {/* Main Table */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  All Students
                </h3>
                {/* Filters */}
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <div className="relative sm:col-span-3">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiSearch className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by student name..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="w-full rounded-full border-gray-300 pl-9 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="rounded-full border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">All Countries</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                  </select>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="rounded-full border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    disabled={!availableCities.length}
                  >
                    <option value="">All Cities</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="max-h-[calc(100vh-28rem)] overflow-auto">
                {filteredStudents && filteredStudents.length > 0 ? (
                  <StudentsDataTable data={filteredStudents} />
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Reusable & Memoized Components ---

const DashboardSkeleton = () => (
  <div className="container mx-auto animate-pulse px-4 py-6">
    <div className="mb-6 h-32 rounded-xl bg-gray-200"></div>
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="h-24 rounded-xl bg-gray-200"></div>
      <div className="h-24 rounded-xl bg-gray-200"></div>
      <div className="h-24 rounded-xl bg-gray-200"></div>
    </div>
    <div className="h-80 rounded-xl bg-gray-200"></div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center p-10 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
      <FaSearch className="h-6 w-6 text-indigo-500" />
    </div>
    <h3 className="mt-4 text-base font-semibold text-gray-800">
      No Students Found
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Adjust your search or filter criteria.
    </p>
  </div>
);

const QuickActionLink = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: JSX.Element;
  label: string;
}) => (
  <Link
    to={to}
    className="flex items-center justify-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/20"
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const Card = ({
  title,
  value,
  icon,
  color = "indigo",
  className = "",
}: {
  title: string;
  value: number;
  icon: JSX.Element;
  color?: "indigo" | "teal" | "yellow";
  className?: string;
}) => {
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-100",
      text: "text-indigo-600",
      hoverBg: "group-hover:bg-indigo-600",
    },
    teal: {
      bg: "bg-teal-100",
      text: "text-teal-600",
      hoverBg: "group-hover:bg-teal-600",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      hoverBg: "group-hover:bg-yellow-600",
    },
  };
  const classes = colorClasses[color];

  return (
    <div
      className={`group rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${classes.bg} ${classes.text} ${classes.hoverBg} group-hover:text-white`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};

const SidebarQuickLink = ({
  to,
  icon,
  label,
}: {
  to: string;
  icon: JSX.Element;
  label: string;
}) => (
  <Link
    to={to}
    className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-600 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
  >
    {icon} {label}
  </Link>
);

const SidebarQuickActions = memo(() => (
  <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
    <h3 className="mb-3 text-base font-semibold text-gray-700">
      Quick Actions
    </h3>
    <div className="space-y-2">
      <SidebarQuickLink
        to="/admin/add-students"
        icon={<FaUserPlus />}
        label="Add New Student"
      />
      <SidebarQuickLink
        to="/admin/batch"
        icon={<FaPlusCircle />}
        label="Create New Batch"
      />
      <SidebarQuickLink
        to="/admin/enquiry"
        icon={<FaPlusCircle />}
        label="Create New Enquiry"
      />
    </div>
  </div>
));

const StudentDistributionChart = memo(
  ({ students }: { students: StudentsType[] | undefined }) => {
    const studentsByBranch = useMemo(() => {
      if (!students) return [];
      const acc = students.reduce(
        (acc, student) => {
          const branch = student.studentsBranch || "Unknown";
          acc[branch] = (acc[branch] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );
      return Object.entries(acc).sort((a, b) => b[1] - a[1]);
    }, [students]);

    if (!students || students.length === 0) return null;
    const totalStudents = students.length;

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-gray-700">
          Students by Branch
        </h3>
        <div className="space-y-3">
          {studentsByBranch.map(([branch, count]) => {
            const percentage =
              totalStudents > 0 ? (count / totalStudents) * 100 : 0;
            return (
              <div key={branch}>
                <div className="mb-1 flex justify-between text-xs font-medium text-gray-600">
                  <span>{branch}</span>
                  <span>
                    {count} ({Math.round(percentage)}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-gray-200">
                  <div
                    className="h-1.5 rounded-full bg-indigo-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

const RecentEnquiries = memo(
  ({ enquiries }: { enquiries: Enquiry[] | undefined }) => {
    const recent = useMemo(() => {
      if (!enquiries) return [];
      return [...enquiries]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 4);
    }, [enquiries]);

    return (
      <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-700">
            Recent Enquiries
          </h3>
          <Link
            to="/admin/enquiry"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        {recent.length > 0 ? (
          <ul className="mt-3 flex-grow space-y-3">
            {recent.map((enquiry) => (
              <li key={enquiry._id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-0.5">
                  <FaQuestionCircle className="h-4 w-4 text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {enquiry.studentName}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    Interested in: {enquiry.instrument}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-grow items-center justify-center text-center">
            <p className="text-sm text-gray-500">No recent enquiries found.</p>
          </div>
        )}
      </div>
    );
  },
);

export default StudentsDashboardPage;
