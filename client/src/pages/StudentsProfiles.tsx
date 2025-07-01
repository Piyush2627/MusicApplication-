import axios from "axios";
import type { StudentsType } from "../types/index.types";

import StudentsDataTable from "../components/common/StudentsDataTable";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CustomInput from "../components/common/CustomInput";
import { FaExclamationTriangle } from "react-icons/fa";

const fetchStudents = async () => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/getAllStudent`,
  );
  return res.data;
};

function StudentsProfiles() {
  const [isSearchInput, setIsSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [filterData, setFilterData] = useState<StudentsType[] | undefined>([]);

  const {
    data: students,
    isLoading,
    isError,
    error,
  } = useQuery<StudentsType[], Error>({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  useEffect(() => {
    if (!students) return;

    const filtered = students.filter((student) => {
      const nameMatch = student.studentName
        .toLowerCase()
        .includes(isSearchInput.toLowerCase());

      const status = student.StudentsStatus?.toLowerCase();
      const statusMatch =
        statusFilter === "all" ? true : status === statusFilter;

      return nameMatch && statusMatch;
    });

    setFilterData(filtered);
  }, [isSearchInput, statusFilter, students]);

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
    <div>
      <div className="flex flex-wrap items-center gap-4 px-4 pb-4">
        <CustomInput
          label="Search Student"
          value={isSearchInput}
          onChange={(e) => setIsSearchInput(e.target.value)}
        />

        <label className="mb-1 text-sm font-medium text-gray-700">
          Filter by Status {filterData?.length}
        </label>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "all" | "active" | "inactive")
          }
          className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <StudentsDataTable data={filterData} pagination />
    </div>
  );
}

export default StudentsProfiles;

const DashboardSkeleton = () => (
  <div className="min-h-screen bg-slate-50">
    <div className="container mx-auto animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 h-12 w-full rounded-md bg-slate-200"></div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="mb-2 h-10 rounded bg-slate-300"></div>
      ))}
    </div>
  </div>
);
