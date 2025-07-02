import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type ClassBatchType } from "../types/index.types";
import StudentCardList from "./common/StudentList";
import { IoSettings } from "react-icons/io5";
import { Link } from "react-router-dom";

function BatchList() {
  const { data = [], isPending } = useQuery<ClassBatchType[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/batches`,
      );
      console.log(res.data);

      return res.data; // Ensure this is an array!
    },
  });

  if (isPending) {
    return <div className="mt-10 text-center text-gray-500">Loading...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="mt-10 text-center text-gray-400">No batches found.</div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-6">
      {data.map((batch) => (
        <div
          key={batch._id}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition duration-300 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              {batch.batchName}
            </h2>
            <Link to={`/admin/editBatch/${batch._id}`}>
              <div>
                <IoSettings />
              </div>
            </Link>
          </div>
          <StudentCardList students={batch.batchStudents} />
        </div>
      ))}
    </div>
  );
}

export default BatchList;
