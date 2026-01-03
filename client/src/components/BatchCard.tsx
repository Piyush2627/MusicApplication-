import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import StudentList from "./common/StudentList";
import { type ClassBatchType, type UserType } from "../types/index.types";

type BatchCardProps = {
  batch: ClassBatchType;
  isOpen: boolean;
  onToggle: () => void;
};

const BatchCard = ({ batch, isOpen, onToggle }: BatchCardProps) => {
  const { data: teacher, isLoading } = useQuery<UserType>({
    queryKey: ["user", batch.batchInstructor],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/getUser/${batch.batchInstructor}`,
      );
      return res.data.data;
    },
    enabled: isOpen,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div
      onClick={onToggle}
      className="mb-2 cursor-pointer border-t-2 border-violet-600 bg-violet-50 p-4 pt-4"
    >
      <div>{batch.batchName}</div>
      <p className="text-2xl font-semibold">{batch.batchTiming}</p>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40 pb-4" : "max-h-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 text-sm font-medium text-gray-600">
          {isLoading
            ? "Loading instructor..."
            : `Instructor: ${teacher?.userName || "N/A"}`}
        </div>

        <StudentList students={batch.batchStudents} />
      </div>
    </div>
  );
};

export default BatchCard;
