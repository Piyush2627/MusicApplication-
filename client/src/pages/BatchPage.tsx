// pages/BatchPage.tsx
import React, { useState } from "react";
import { CreateBatchForm } from "../components/CreateBatchForm";
import AddModal from "../components/AddModal";
import useAuth from "../hooks/userAuth";
import BatchCalender from "../components/BatchCalender";

const BatchPage: React.FC = () => {
  const [isBatchModal, setIsBatchModal] = useState(false);
  const isBatchModalOpen = () => setIsBatchModal(true);
  const isBatchModalClose = () => setIsBatchModal(false);
  return (
    <div className="flex flex-col p-6">
      <div className="flex flex-row justify-between">
        <div>
          <p className="font-Alexana text-2xl font-bold">
            Batch component hello there
          </p>{" "}
        </div>
        <button
          className="rounded bg-violet-400 p-2 px-2 text-white"
          onClick={isBatchModalOpen}
        >
          Add Batch
        </button>
      </div>

      <AddModal
        onClose={isBatchModalClose}
        isOpen={isBatchModal}
        tittle="Add Batch "
      >
        <CreateBatchForm />
      </AddModal>
      <BatchCalender />
    </div>
  );
};

export default BatchPage;
