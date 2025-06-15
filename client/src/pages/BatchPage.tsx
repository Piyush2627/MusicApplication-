// pages/BatchPage.tsx
import React from "react";
import { CreateBatchForm } from "../components/CreateBatchForm";
import BatchList from "../components/BatchList";

const BatchPage: React.FC = () => {
  return (
    <div className="flex p-6">
      <CreateBatchForm />
      <BatchList />
    </div>
  );
};

export default BatchPage;
