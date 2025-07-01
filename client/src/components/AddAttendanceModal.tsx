import React from "react";
import AddAttendanceForm from "./AddAttendanceForm"; // adjust path

interface AddAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddAttendanceModal: React.FC<AddAttendanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="relative mx-4 w-full max-w-2xl rounded-xl bg-white shadow-lg"
        style={{ maxHeight: "90vh" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          X
        </button>

        {/* Scrollable content */}
        <div className="max-h-[80vh] overflow-y-auto p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Add Attendance
          </h2>
          <AddAttendanceForm />
        </div>
      </div>
    </div>
  );
};

export default AddAttendanceModal;
