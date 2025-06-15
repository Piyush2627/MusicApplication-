import React from "react";
import { type StudentsType } from "../../types/index.types";

type Props = {
  students: StudentsType[];
};

const StudentList: React.FC<Props> = ({ students }) => {
  if (!students || students.length === 0) {
    return (
      <p className="mt-10 text-center text-gray-500">No students found.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm text-gray-700 uppercase">
            <th className="px-4 py-2">Name</th>

            <th className="px-4 py-2">Mobile</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student._id}
              className="border-b transition-colors hover:bg-gray-50"
            >
              <td className="px-4 py-2 text-sm font-medium text-gray-800">
                {student.studentName}
              </td>

              <td className="px-4 py-2 text-sm text-gray-700">
                {student.studentsMobileNumber}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
