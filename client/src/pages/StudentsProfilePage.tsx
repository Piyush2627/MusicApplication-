import { useQuery } from "@tanstack/react-query";
import { type StudentsType } from "../types/index.types";
import axios from "axios";
function StudentsProfilePage() {
  const { data } = useQuery<StudentsType[]>({
    queryKey: ["student"],
    queryFn: async () => {
      const res = await axios.get("/api/getAllStudent");
      return res.data;
    },
  });
  return (
    <div>
      StudentsProfilePage{" "}
      {data?.map((ele) => {
        return <div> {ele.studentName}</div>;
      })}
    </div>
  );
}

export default StudentsProfilePage;
