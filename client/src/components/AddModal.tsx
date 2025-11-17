import React, { type ReactNode } from "react";
import { IoClose } from "react-icons/io5";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const AddModal: React.FC<AddModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="relative mx-4 w-full max-w-2xl rounded-xl bg-white shadow-lg"
        style={{ maxHeight: "90vh" }}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <IoClose size={32} />
        </button>
        <div className="max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default AddModal;
