// import AddAttendanceForm from "./AddAttendanceForm";
import AttendanceList from "./AttendanceList";

function AttendanceDashboard() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">
        Attendance Dashboard
      </h1>

      <AttendanceList />
    </div>
  );
}

export default AttendanceDashboard;
