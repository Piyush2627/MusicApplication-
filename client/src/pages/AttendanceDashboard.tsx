import AddAttendanceForm from "./AddAttendanceForm";
import AttendanceList from "./AttendanceList";

function AttendanceDashboard() {
  return (
    <div className="container mx-auto flex space-x-8 px-4 py-6">
      {/* Form at the top */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Mark Attendance</h2>
        <div className="max-w-xl">
          <AddAttendanceForm />
        </div>
      </div>

      {/* Attendance list below */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Attendance Records</h2>
        <div className="h-screen w-full overflow-auto rounded-xl bg-white p-6 pr-2 shadow-lg sm:p-8">
          <AttendanceList />
        </div>
      </div>
    </div>
  );
}

export default AttendanceDashboard;
