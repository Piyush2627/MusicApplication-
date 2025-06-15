import axios from "axios";

//types
import { type StudentsType } from "../types/index.types";
import { useQuery } from "@tanstack/react-query";

function StudentAttendanceView() {
  const fetchStudents = async (): Promise<StudentsType[]> => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/getAllStudent`,
    );
    console.log(response.data.data);
    return response.data.data;
  };

  //Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  if (isLoading)
    return (
      <div className="w-full p-6 text-center text-gray-500">
        Loading attendance records...
      </div>
    );

  if (isError)
    return (
      <div className="w-full p-6 text-center text-red-600">
        Error loading attendance: {(error as Error).message}
      </div>
    );
  return (
    <div>
      StudentAttendanceView
      {data?.map((ele) => {
        return <div key={ele._id}>hi</div>;
      })}
    </div>
  );
}

export default StudentAttendanceView;
