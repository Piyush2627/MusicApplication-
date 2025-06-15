import axios from "axios";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { type ClassBatchType, type StudentsType } from "../types/index.types";

import InitialsAvatar from "../components/common/InitialsAvatar";
import {
  FaUsers,
  FaExclamationTriangle,
  FaLayerGroup,
  FaPlusCircle,
  FaUserPlus,
} from "react-icons/fa";
import { FiChevronRight, FiSearch } from "react-icons/fi";
import { useEffect, useState, type ChangeEvent } from "react";

const fetchStudents = async (): Promise<StudentsType[]> => {
  const { data } = await axios.get("/api/getAllStudent");
  return data;
};

const fetchBatches = async (): Promise<ClassBatchType[]> => {
  const { data } = await axios.get("/api/batches");
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
    const filtered = students.filter((student) => {
      const matchesName = student.studentName
        .toLowerCase()
        .includes(studentSearch.toLowerCase());
      const matchesCountry = selectedCountry
        ? student.studentsAddress.country?.toLowerCase() ===
          selectedCountry.toLowerCase()
        : true;

      const cityMatch = selectedCity
        ? student.studentsAddress.city?.toLowerCase() ===
          selectedCity.toLowerCase()
        : true;

      const citiesSet = new Set<string>();
      students.forEach((student) => {
        const city = student.studentsAddress.city;
        if (city) citiesSet.add(city);
      });

      setAvailableCities(Array.from(citiesSet));

      return matchesName && matchesCountry && cityMatch;
    });

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
    <div className="w-full bg-slate-50">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-yellow-400 p-8 text-white shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-tight">
              Student Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-indigo-100">
              Welcome back! Here's an overview of all registered students. You
              can view details or manage records below.
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-white/10"></div>
          <div className="absolute bottom-0 left-0 -mb-12 ml-4 h-32 w-32 rounded-full bg-white/10"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          {/* Sidebar Cards */}
          <div className="space-y-8 lg:col-span-1">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Students
                    </p>
                    <p className="mt-1 text-4xl font-bold text-gray-800">
                      {students?.length ?? 0}
                    </p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white">
                    <FaUsers size={24} />
                  </div>
                </div>
              </div>

              <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Batches
                    </p>
                    <p className="mt-1 text-4xl font-bold text-gray-800">
                      {classBatch?.length ?? 0}
                    </p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white">
                    <FaLayerGroup size={24} />
                  </div>
                </div>
              </div>
              <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Batches
                    </p>
                    <p className="mt-1 text-4xl font-bold text-gray-800">
                      {classBatch?.length ?? 0}
                    </p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white">
                    <FaLayerGroup size={24} />
                  </div>
                </div>
              </div>
              <div className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Total Batches
                    </p>
                    <p className="mt-1 text-4xl font-bold text-gray-800">
                      {classBatch?.length ?? 0}
                    </p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white">
                    <FaLayerGroup size={24} />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-base font-semibold text-gray-700">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  to="/add-students"
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <FaUserPlus className="h-5 w-5" /> Add New Student
                </Link>
                <Link
                  to="/batch"
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-600"
                >
                  <FaPlusCircle className="h-5 w-5" /> Create New Batch
                </Link>
                <Link
                  to="/enquiry"
                  className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-600"
                >
                  <FaPlusCircle className="h-5 w-5" /> Create New Enquiry
                </Link>
              </div>
            </div>
          </div>

          {/* Students Table */}
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

                {/* Search & Filter Controls */}
                <div className="mt-3 flex flex-col gap-2 sm:mt-0 sm:ml-4 sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-auto">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="search-student"
                      className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                      placeholder="Search..."
                      value={studentSearch}
                      onChange={handleInputSearchStudent}
                    />
                  </div>

                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="">All Countries</option>
                    <option value="India">India</option>
                    <option value="Australia">Australia</option>
                    {/* Add more countries if needed */}
                  </select>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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

              {/* Students Table */}
              <div className="h-95 overflow-x-auto rounded-2xl">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Details</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {(filteredStudents ?? students)?.map((student) => (
                      <tr
                        key={student._id}
                        className="transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <InitialsAvatar
                              name={student.studentName}
                              imageUrl={student.studentsProfile}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">
                                {student.studentName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {student.studentsMobileNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            {student.studentsAddress.city}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                          <Link
                            to={`/studentsInfo/${student._id}`}
                            className="flex items-center justify-end text-indigo-600 hover:text-indigo-800"
                          >
                            Details <FiChevronRight className="ml-1" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
      <div className="mb-8 h-36 rounded-xl bg-slate-200"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
        <div className="mb-8 lg:col-span-1 lg:mb-0">
          <div className="h-28 rounded-xl bg-slate-200"></div>
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-xl bg-slate-200">
            <div className="h-12 rounded-t-xl bg-slate-300"></div>
            <div className="space-y-4 p-4">
              <div className="h-10 rounded bg-slate-300"></div>
              <div className="h-10 rounded bg-slate-300"></div>
              <div className="h-10 rounded bg-slate-300"></div>
              <div className="h-10 rounded bg-slate-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default StudentsDashboardPage;
