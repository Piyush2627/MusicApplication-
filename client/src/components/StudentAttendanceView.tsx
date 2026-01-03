import axios from "axios";
import { type AttendanceType } from "../types/index.types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const id = "6953a3e8a21ae765b9ed57ee";
const fetchAttendance = async (): Promise<AttendanceType[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/attendance/student/${id}`,
  );
  return response.data.data;
};

const chunk = (arr: AttendanceType[]) => {
  const maxChunk = 8;
  const coverUp = 2;
  let i = 0;
  const block = [];
  console.log("inside function");
  while (i < arr.length) {
    const base = arr.slice(i, i + maxChunk);
    const absence = base.filter(
      (ele) => ele.attendanceRecord[0]?.attendanceStatus == "Absent",
    ).length;
    const cover = Math.min(absence, coverUp);
    const totalChunk = maxChunk + cover;
    block.push(arr.slice(i, i + totalChunk));
    i = i + 8;
  }
  return block;
};

function StudentAttendanceView() {
  const { data: AttendanceData = [] } = useQuery({
    queryKey: ["attendance"],
    queryFn: fetchAttendance,
  });
  useEffect(() => {
    if (AttendanceData.length > 0) {
      chunk(AttendanceData);
    }
  }, [AttendanceData]);
  return (
    <div className="font-poppins-medium">
      <div className="mt-1 px-4 text-gray-600">StudentAttendanceView</div>
      <div className="px-4">
        {AttendanceData.map((ele) => {
          return <div key={ele._id}>{ele.attendanceRemark}</div>;
        })}
      </div>
    </div>
  );
}

export default StudentAttendanceView;
