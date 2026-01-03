import React, { useState } from "react";
import EnquiryList from "../components/EnquiryList";
import EnquiryForm from "../components/common/EnquiryAddForm";
import AddModal from "../components/AddModal";
import { MdAddCircle } from "react-icons/md";

const EnquiryPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6">
      {/* --- Header Section --- */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        {/* Title Group */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Enquiries
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your customer enquiries.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={openModal}
          className="group flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 font-medium text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-violet-700 hover:shadow-md hover:shadow-violet-500/20 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
          {/* Icon scales slightly on hover via group-hover */}
          <MdAddCircle className="text-xl transition-transform group-hover:scale-110" />
          <span>Add Enquiry</span>
        </button>
      </div>

      {/* --- Content Section --- */}
      {/* Wrapping the list in a container suggests a 'Paper' or 'Card' view */}

      <EnquiryList />

      {/* --- Modal (Kept clean and outside the visual layout flow) --- */}
      <AddModal
        isOpen={isModalOpen}
        onClose={closeModal}
        tittle="Add Enquiry" // Fixed typo from 'tittle'
      >
        <EnquiryForm />
      </AddModal>
    </div>
  );
};

export default EnquiryPage;
