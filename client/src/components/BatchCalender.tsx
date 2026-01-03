import axios from "axios";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { type UserType, type ClassBatchType } from "../types/index.types";
import { useMemo, useState } from "react";
import { format, compareAsc, parseISO } from "date-fns";
import StudentList from "./common/StudentList";
import useAuth from "../hooks/userAuth";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const daysOrder = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

type GroupedSchedule = {
  [key: string]: ClassBatchType[];
};

const BatchInstructorInfo = ({
  teacherId,
  isOpen,
}: {
  teacherId: string;
  isOpen: boolean;
}) => {
  const { data: teacher, isLoading } = useQuery<UserType>({
    queryKey: ["user", teacherId],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/getUser/${teacherId}`,
      );

      console.log("INSTRUCTOR DATA:", res.data.data);
      return res.data.data;
    },
    enabled: !!teacherId && isOpen, // Optimization: Don't fetch until user opens it
    staleTime: 1000 * 60 * 5, // Cache for 5 mins to prevent refetching on every toggle
  });
  if (isLoading)
    return <div className="text-sm text-gray-500">Loading instructor...</div>;

  return (
    <div className="font-medium text-gray-700">
      {teacher?.userName || "Unknown Instructor"}
    </div>
  );
};

function BatchCalender() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [isStudentsAccordionToggle, setIsStudentsAccordionToggle] = useState<
    string | null
  >(null);

  const deleteBatch = async (batchId: string) => {
    const response = await axios.delete(
      `${import.meta.env.VITE_API_BASE_URL}/batches/${batchId}`,
    );
    return response.data;
  };

  const { data = [] } = useQuery<ClassBatchType[]>({
    queryKey: ["batches"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/batches`,
      );
      return res.data.data;
    },
  });

  const delMutation = useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      console.log("data loaded");
    },
  });
  const handelDeleteBatch = (batchId: string) => {
    delMutation.mutate(batchId);
  };
  const scheduleByDay = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return {};

    const sorted = [...data].sort((a, b) => {
      const dateStrA = a.batchStartDate;
      const dateStrB = b.batchStartDate;
      if (!dateStrA && !dateStrB) return 0;
      if (!dateStrA) return 1;
      if (!dateStrB) return -1;
      return compareAsc(parseISO(dateStrA), parseISO(dateStrB));
    });

    return sorted.reduce<GroupedSchedule>((acc, item) => {
      if (!item.batchStartDate) return acc;

      const date = parseISO(item.batchStartDate);

      const dayName = format(date, "EEEE");

      if (!acc[dayName]) acc[dayName] = [];
      acc[dayName].push(item);
      return acc;
    }, {});
  }, [data]);

  const toggleAccordion = (index: string) => {
    setIsStudentsAccordionToggle(
      isStudentsAccordionToggle === index ? null : index,
    );
  };

  return (
    <>
      <div className="font-poppins font-bold tracking-wider">
        Hello, {user.name}
      </div>
      <div className="flex flex-row justify-between p-2">
        {daysOrder.map((day, index) => (
          <div key={index} className="px-2">
            <h2 className="mb-4 text-xl font-bold text-violet-700">{day}</h2>
            {scheduleByDay[day]?.map((batch) => {
              const isOpen = isStudentsAccordionToggle === batch._id;

              return (
                <div
                  onClick={() => toggleAccordion(batch._id)}
                  key={batch._id}
                  className="mb-2 cursor-pointer border-t-2 border-violet-600 bg-violet-50 p-4 pt-4 text-left"
                >
                  <div>{batch.batchName}</div>
                  <p className="text-2xl font-semibold">{batch.batchTiming}</p>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 pb-4" : "max-h-0"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <BatchInstructorInfo
                      teacherId={batch.batchInstructor._id}
                      isOpen={isOpen}
                    />

                    <StudentList students={batch.batchStudents} />
                    <div className="flex justify-between px-2 py-4 text-xl text-gray-600">
                      <button
                        className="text-red-300 transition-colors duration-200 hover:text-red-500"
                        onClick={() => handelDeleteBatch(batch._id)}
                      >
                        <MdDelete />
                      </button>
                      <Link to={`editBatch/${batch._id}`}>
                        <FaEdit />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

export default BatchCalender;
