import { useState } from "react";
import axios from "axios";
import type { StudentsType } from "../../types/index.types";
import { useQuery } from "@tanstack/react-query";
import InitialsAvatar from "./InitialsAvatar";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

interface StudentsDataTableProps {
  data?: StudentsType[];
  pagination?: boolean;
  paginationLines?: number;
}

const fetchStudents = async (): Promise<StudentsType[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/getAllStudent`,
  );
  return data;
};

function StudentsDataTable({
  data,
  pagination = false,
  paginationLines = 7,
}: StudentsDataTableProps) {
  const { data: students } = useQuery<StudentsType[], Error>({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });
  const ITEMS_PER_PAGE = paginationLines;

  const combinedData = data ?? students ?? [];
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(combinedData.length / ITEMS_PER_PAGE);

  const displayedStudents = pagination
    ? combinedData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : combinedData;

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
              Student Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
              City
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {displayedStudents.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-4 text-center text-sm text-gray-500 italic"
              >
                No students found matching your criteria.
              </td>
            </tr>
          ) : (
            displayedStudents.map((student, index) => (
              <tr
                key={student._id}
                className={`transition hover:bg-indigo-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <InitialsAvatar
                      name={student.studentName}
                      imageUrl={student.studentsProfile}
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {student.studentName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.studentsMobileNumber}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      student.StudentsStatus === "Active"
                        ? "bg-green-100 text-green-800"
                        : student.StudentsStatus === "Inactive"
                          ? "bg-red-100 text-red-800"
                          : student.StudentsStatus === "Freezed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                    } `}
                  >
                    {student.StudentsStatus || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                  <Link
                    to={`/admin/studentsInfo/${student._id}`}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    View <FiChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Conditionally Render Pagination Controls */}
      {pagination && displayedStudents.length > 0 && (
        <div className="mt-4 flex items-center justify-between px-6">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`rounded border px-4 py-2 text-sm font-medium ${
              currentPage === 1
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`rounded border px-4 py-2 text-sm font-medium ${
              currentPage === totalPages
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default StudentsDataTable;
