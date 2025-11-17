import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMail,
  FiPhone,
  FiClock,
  FiPlus,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";

interface Remark {
  note: string;
  addedBy: string;
  createdAt: string;
}

interface Enquiry {
  _id: string;
  studentName: string;
  email: string;
  phone: string;
  instrument: string;
  preferredTime: string;
  status: string;
  createdAt: string;
  remarks?: Remark[];
}

const fetchEnquiries = async (): Promise<Enquiry[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/api/enquiries`,
  );
  return data;
};

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const EnquiryList: React.FC = () => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [remarkInputs, setRemarkInputs] = useState<
    Record<string, { note: string; addedBy: string }>
  >({});
  const queryClient = useQueryClient();

  const {
    data: enquiries,
    isLoading,
    isError,
    error,
  } = useQuery<Enquiry[], Error>({
    queryKey: ["enquiries"],
    queryFn: fetchEnquiries,
  });

  const addRemarkMutation = useMutation({
    mutationFn: async ({
      enquiryId,
      note,
      addedBy,
    }: {
      enquiryId: string;
      note: string;
      addedBy: string;
    }) => {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/enquiries/${enquiryId}/remarks`,
        {
          note,
          addedBy,
        },
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      setRemarkInputs((prev) => ({
        ...prev,
        [variables.enquiryId]: { note: "", addedBy: "" },
      }));
    },
  });

  const handleAddRemark = (enquiryId: string) => {
    const input = remarkInputs[enquiryId];
    if (!input?.note.trim() || !input?.addedBy.trim()) return;
    addRemarkMutation.mutate({
      enquiryId,
      note: input.note,
      addedBy: input.addedBy,
    });
  };

  if (isLoading)
    return (
      <div className="flex h-40 flex-col items-center justify-center p-4 text-blue-700">
        <FiLoader className="mb-2 animate-spin text-2xl" />
        <span>Loading enquiries...</span>
      </div>
    );
  if (isError)
    return (
      <div className="flex flex-col items-center p-6 text-red-700">
        <FiAlertCircle className="mb-2 text-3xl" />
        <div>Error: {error.message}</div>
      </div>
    );

  if (!enquiries?.length)
    return (
      <div className="flex h-44 flex-col items-center justify-center text-gray-500">
        <FiAlertCircle className="mb-2 text-3xl" />
        No enquiries found.
      </div>
    );

  return (
    <div className="mx-auto w-full">
      <h2 className="mb-6 text-2xl font-bold">All Enquiries</h2>
      <div className="space-y-5">
        {enquiries.map((enquiry) => (
          <div
            key={enquiry._id}
            className="group rounded-lg border bg-white p-4 shadow-sm ring-blue-400 transition focus-within:ring-2"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <FiUser className="inline text-blue-500" />
                  {enquiry.studentName}
                </div>
                <div className="mt-0.5 flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiMail />
                    {enquiry.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiPhone />
                    {enquiry.phone}
                  </span>
                </div>
                <div className="mt-1 flex gap-3 text-sm">
                  <span className="rounded bg-blue-50 px-2 py-0.5">
                    {enquiry.instrument}
                  </span>
                  <span className="rounded bg-slate-50 px-2 py-0.5">
                    <FiClock className="inline" /> {enquiry.preferredTime}
                  </span>
                  <span
                    className={
                      "rounded px-2 py-0.5 " + statusColor(enquiry.status)
                    }
                  >
                    {/* You can add icons for status here */}
                    {enquiry.status}
                  </span>
                  <span className="text-gray-400">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() =>
                  setExpandedRow(
                    expandedRow === enquiry._id ? null : enquiry._id,
                  )
                }
                className="rounded p-2 transition hover:bg-blue-50"
                aria-label={
                  expandedRow === enquiry._id ? "Hide details" : "Show more"
                }
              >
                {expandedRow === enquiry._id ? (
                  <FiChevronUp />
                ) : (
                  <FiChevronDown />
                )}
              </button>
            </div>

            {expandedRow === enquiry._id && (
              <div className="animate-fade-in mt-4 border-t pt-4">
                <div>
                  <strong>Remarks:</strong>
                  <ul className="mt-2 ml-4 list-disc space-y-1 text-sm">
                    {enquiry.remarks?.length ? (
                      enquiry.remarks.map((remark, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{remark.addedBy}:</span>{" "}
                          {remark.note}{" "}
                          <span className="text-xs text-gray-500">
                            ({new Date(remark.createdAt).toLocaleString()})
                          </span>
                        </li>
                      ))
                    ) : (
                      <li>No remarks yet.</li>
                    )}
                  </ul>
                </div>

                <div className="mt-5">
                  <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      value={remarkInputs[enquiry._id]?.note || ""}
                      onChange={(e) =>
                        setRemarkInputs((prev) => ({
                          ...prev,
                          [enquiry._id]: {
                            ...prev[enquiry._id],
                            note: e.target.value,
                          },
                        }))
                      }
                      placeholder="Remark note"
                      className="flex-1 rounded border border-gray-300 px-2 py-1"
                    />
                    <input
                      type="text"
                      value={remarkInputs[enquiry._id]?.addedBy || ""}
                      onChange={(e) =>
                        setRemarkInputs((prev) => ({
                          ...prev,
                          [enquiry._id]: {
                            ...prev[enquiry._id],
                            addedBy: e.target.value,
                          },
                        }))
                      }
                      placeholder="Added by"
                      className="flex-1 rounded border border-gray-300 px-2 py-1"
                    />
                    <button
                      onClick={() => handleAddRemark(enquiry._id)}
                      className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                      disabled={addRemarkMutation.isPending}
                    >
                      <FiPlus />
                      {addRemarkMutation.isPending ? "Adding..." : "Add Remark"}
                    </button>
                  </div>
                  {/* Validation feedback example */}
                  {addRemarkMutation.isError && (
                    <div className="mt-2 text-sm text-red-500">
                      Unable to add remark. Please try again.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnquiryList;
