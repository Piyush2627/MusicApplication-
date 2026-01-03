// const monthlyAttendance: boolean[] = [
//   true,
//   true,
//   true,
//   true,
//   true,
//   true,

import StudentAttendanceView from "../components/StudentAttendanceView";

//   true,
//   true,
//   false,
//   true,
//   true,
//   true,
//   true,
//   true,
//   false,
//   true,
//   true,
//   true,
//   true,
//   false,
//   true,
//   true,
//   true,
//   false,
//   false,
//   true,
//   true,
//   true,
// ];

// function processMonthlyAttendance(attendance: boolean[]) {
//   const BASE_CLASSES = 8;
//   const MAX_COVER_UP = 2;

//   let i = 0;
//   const blocks = [];

//   while (i < attendance.length) {
//     const base = attendance.slice(i, i + BASE_CLASSES);
//     const absences = base.filter((v) => v === false).length;
//     const coverUp = Math.min(absences, MAX_COVER_UP);
//     const total = BASE_CLASSES + coverUp;
//     const blockAttendance = attendance.slice(i, i + total);
//     blocks.push({
//       totalClasses: total,
//       attendance: blockAttendance,
//       absences,
//     });
//     i += total;
//   }

//   return blocks;
// }

// console.log(processMonthlyAttendance(monthlyAttendance));
const arr = [
  {
    id: 1,
    name: "Piyush",
    flag: true,
  },
  {
    id: 2,
    name: "main",
    flag: true,
  },
  {
    id: 3,
    name: "hello",
    flag: true,
  },
  {
    id: 5,
    name: "there",
    flag: false,
  },
  {
    id: 4,
    name: "siya",
    flag: true,
  },
  {
    id: 5,
    name: "jiya",
    flag: true,
  },
  {
    id: 1,
    name: "Piyush",
    flag: true,
  },
  {
    id: 2,
    name: "main",
    flag: true,
  },
  {
    id: 3,
    name: "hello",
    flag: true,
  },
  {
    id: 5,
    name: "there",
    flag: false,
  },
  {
    id: 4,
    name: "siya",
    flag: true,
  },
  {
    id: 5,
    name: "jiya",
    flag: false,
  },
];

function chunkFunction() {
  const maxArray = 8;
  const coverup = 2;
  let i = 0;
  const block = [];
  while (i < arr.length) {
    const base = arr.slice(i, i + maxArray);
    const absence = base.filter((ele) => ele.flag === false).length;
    const endCoverUp = Math.min(absence, coverup);
    const total = endCoverUp + maxArray;
    block.push(arr.slice(i, i + total));

    i = i + total;
  }
  return block;
}

chunkFunction();
function AssignmentPage() {
  return (
    <div>
      <div className="font-poppins mt-6 px-4 text-4xl font-black">
        Assignment
      </div>
      <div>
        <StudentAttendanceView />
      </div>
    </div>
  );
}

export default AssignmentPage;
