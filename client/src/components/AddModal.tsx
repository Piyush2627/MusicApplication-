import type { ReactElement } from "react";
import type React from "react";
interface AddModelType {
  children: React.ReactNode | ReactElement;
  isOpen: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  tittle?: string;
}
const AddModal = ({ children, tittle, isOpen, onClose }: AddModelType) => {
  if (!isOpen) {
    return null;
  }
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="animate-fade-in-up relative m-4 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Header Section --- */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {tittle || "Modal Title"}
          </h3>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
            aria-label="Close"
          >
            {/* SVG Close Icon for crisper look */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* --- Body Section --- */}
        <div className="p-6 text-gray-600">{children}</div>
      </div>
    </div>
  );
};
export default AddModal;
