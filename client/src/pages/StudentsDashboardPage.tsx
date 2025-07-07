import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { type ClassBatchType, type StudentsType } from "../types/index.types";
import { useEffect, useState, type ChangeEvent, type JSX } from "react";
import {
  FaUsers,
  FaExclamationTriangle,
  FaLayerGroup,
  FaPlusCircle,
  FaUserPlus,
} from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import StudentsDataTable from "../components/common/StudentsDataTable";

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

function StudentsDashboardPage() {
  const [filteredStudents, setFilteredStudents] = useState<StudentsType[]>();
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [availableCities, setAvailableCities] = useState<string[]>([]);

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

  const handleInputSearchStudent = (event: ChangeEvent<HTMLInputElement>) => {
    setStudentSearch(event.target.value);
  };

  useEffect(() => {
    if (!students) return;

    const citiesSet = new Set<string>();
    const filtered = students.filter((student) => {
      const name = student?.studentName ?? "";
      const country = student?.studentsAddress?.country ?? "";
      const city = student?.studentsAddress?.city ?? "";

      const nameMatch = name
        .toLowerCase()
        .includes(studentSearch.toLowerCase());
      const countryMatch = selectedCountry
        ? country.toLowerCase() === selectedCountry.toLowerCase()
        : true;
      const cityMatch = selectedCity
        ? city.toLowerCase() === selectedCity.toLowerCase()
        : true;

      if (city) citiesSet.add(city);

      return nameMatch && countryMatch && cityMatch;
    });

    setAvailableCities(Array.from(citiesSet));
    setFilteredStudents(filtered);
  }, [students, studentSearch, selectedCountry, selectedCity]);

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-red-50 text-red-700">
        <FaExclamationTriangle className="mb-4 h-16 w-16" />
        <h2 className="mb-2 text-2xl font-bold">Failed to load student data</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        {/* <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-yellow-400 p-8 text-white shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight">
              Student Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-indigo-100">
              Welcome back! Here's an overview of all registered students. You
              can view details or manage records below.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 -mb-12 ml-4 h-32 w-32 rounded-full bg-white/10" />
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          {/* Sidebar */}
          <div className="space-y-8 lg:col-span-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <Card
                title="Total Students"
                value={students?.length ?? 0}
                icon={<FaUsers />}
                color="indigo"
              />
              <Card
                title="Total Batches"
                value={classBatch?.length ?? 0}
                icon={<FaLayerGroup />}
                color="teal"
              />{" "}
              <Card
                title="Inactive"
                value={
                  students?.filter((ele) => {
                    const active = ele.StudentsStatus == "Inactive";
                    return active;
                  }).length ?? 0
                }
                icon={<FaLayerGroup />}
                color="teal"
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-gray-700">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <QuickLink
                  to="/add-students"
                  icon={<FaUserPlus />}
                  label="Add New Student"
                />
                <QuickLink
                  to="/batch"
                  icon={<FaPlusCircle />}
                  label="Create New Batch"
                />
                <QuickLink
                  to="/enquiry"
                  icon={<FaPlusCircle />}
                  label="Create New Enquiry"
                />
              </div>
            </div>
          </div>

          {/* Main Table */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-gray-200 bg-white shadow-md">
              <div className="border-b border-gray-200 p-4 sm:flex sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Students
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    A list of all students in your records.
                  </p>
                </div>

                <div className="mt-3 flex flex-col gap-2 sm:mt-0 sm:flex-row sm:items-center sm:gap-4">
                  <div className="relative w-full sm:w-60">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={studentSearch}
                      onChange={handleInputSearchStudent}
                      className="w-full rounded-full border border-gray-300 bg-white py-2 pr-4 pl-10 text-sm text-gray-700 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="">All Countries</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                  </select>

                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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

              <div className="h-95 overflow-x-auto rounded-2xl">
                <StudentsDataTable data={filteredStudents} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="container mx-auto animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-36 rounded-xl bg-gradient-to-r from-slate-200 to-slate-100"></div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4">
          <div className="h-24 rounded-xl bg-slate-200"></div>
          <div className="h-40 rounded-xl bg-slate-200"></div>
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="h-12 w-full rounded-md bg-slate-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 rounded bg-slate-300"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Reusable Components

const Card = ({
  title,
  value,
  icon,
  color = "indigo",
}: {
  title: string;
  value: number;
  icon: JSX.Element;
  color?: string;
}) => (
  <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-md transition-transform hover:scale-[1.02] hover:shadow-lg">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="mt-1 text-4xl font-bold text-gray-800">{value}</p>
      </div>
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-${color}-100 text-${color}-600 group-hover:bg-${color}-600 group-hover:text-white`}
      >
        {icon}
      </div>
    </div>
  </div>
);

const QuickLink = ({
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
    className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
  >
    {icon} {label}
  </Link>
);

export default StudentsDashboardPage;
