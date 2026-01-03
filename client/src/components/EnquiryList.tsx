import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { EnquiryType } from "../types/index.types";
import { useMemo, useState, type ChangeEvent } from "react";
import {
  FaChevronDown,
  FaSearch,
  FaPhone,
  FaMusic,
  FaCalendarAlt,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";

const fetchEnquiries = async (): Promise<EnquiryType[]> => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/enquiries`,
  );
  return data || [];
};

const postRemark = async ({
  enquiryId,
  note,
  addedBy,
}: {
  enquiryId: string;
  note: string;
  addedBy: string;
}) => {
  await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/enquiries/${enquiryId}/remarks`,
    { note, addedBy },
  );
};

const updateFollowUp = async ({ id, date }: { id: string; date: string }) => {
  await axios.put(`${import.meta.env.VITE_API_BASE_URL}/enquiries/${id}`, {
    followUp: date,
  });
};

// --- HELPER ---
const formatDateForInput = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

function EnquiryList() {
  const queryClient = useQueryClient();

  // Search State
  const [isEnquirySearchByName, setIsEnquirySearchByName] = useState("");
  const [isEnquirySearchByPhone, setIsEnquirySearchByPhone] = useState("");

  // UI State
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  // Action State
  const [remarkForm, setRemarkForm] = useState({ note: "", addedBy: "" });
  const [selectedDate, setSelectedDate] = useState("");

  // --- QUERIES & MUTATIONS ---

  const {
    data: enquiries,
    isLoading,
    isError,
    error,
  } = useQuery<EnquiryType[]>({
    queryKey: ["enquiries"],
    queryFn: fetchEnquiries,
  });

  const addRemarkMutation = useMutation({
    mutationFn: postRemark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Remark added successfully");
      setRemarkForm({ note: "", addedBy: "" });
    },
    onError: () => toast.error("Failed to add remark"),
  });

  const updateDateMutation = useMutation({
    mutationFn: updateFollowUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
      toast.success("Follow-up date updated");
    },
    onError: () => toast.error("Failed to update date"),
  });

  const handleAccordionToggle = (id: string) => {
    if (openAccordionId === id) {
      setOpenAccordionId(null);
      setSelectedDate("");
    } else {
      setOpenAccordionId(id);
      // Pre-fill date
      const current = enquiries?.find((e) => e._id === id);
      setSelectedDate(
        current?.followUp ? formatDateForInput(current.followUp) : "",
      );
      // Clear remark form when switching users
      setRemarkForm({ note: "", addedBy: "" });
    }
  };

  const handleRemarkChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRemarkForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitRemark = (enquiryId: string) => {
    if (!remarkForm.note.trim() || !remarkForm.addedBy.trim()) {
      toast.error("Please fill in both note and name");
      return;
    }
    addRemarkMutation.mutate({
      enquiryId,
      note: remarkForm.note,
      addedBy: remarkForm.addedBy,
    });
  };

  const handleSaveDate = (id: string) => {
    if (!selectedDate) {
      toast.error("Please select a valid date");
      return;
    }
    updateDateMutation.mutate({ id, date: selectedDate });
  };

  // --- FILTER ---

  const filterEnquiryData = useMemo(() => {
    if (!enquiries) return [];
    return enquiries.filter((item) => {
      const name = (item.studentName || "").toLowerCase();
      const phone = (item.phone || "").toLowerCase();
      return (
        name.includes(isEnquirySearchByName.toLowerCase()) &&
        phone.includes(isEnquirySearchByPhone.toLowerCase())
      );
    });
  }, [enquiries, isEnquirySearchByName, isEnquirySearchByPhone]);

  if (isLoading)
    return (
      <div className="flex h-64 items-center justify-center text-gray-500">
        Loading enquiries...
      </div>
    );
  if (isError)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <Toaster position="top-right" />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Enquiries</h2>
            <p className="text-sm text-gray-500">
              Manage student leads and follow-ups
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-blue-100 px-3 text-sm font-bold text-blue-700">
              {enquiries?.length || 0}
            </span>
            <span className="text-sm text-gray-500">Total Records</span>
          </div>
        </div>
        <div className="flex h-full flex-col lg:flex-row">
          {/* LEFT COLUMN: List & Search */}
          <div className="flex flex-1 flex-col border-r border-gray-100 lg:w-2/3">
            {/* Search Bar */}
            <div className="grid grid-cols-1 gap-4 border-b border-gray-100 bg-gray-50/50 p-4 sm:grid-cols-2">
              <div className="relative">
                <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Name"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-700 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={isEnquirySearchByName}
                  onChange={(e) => setIsEnquirySearchByName(e.target.value)}
                />
              </div>
              <div className="relative">
                <FaPhone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by Phone"
                  className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-700 transition-all outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  value={isEnquirySearchByPhone}
                  onChange={(e) => setIsEnquirySearchByPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              <div className="space-y-3">
                {filterEnquiryData.length > 0 ? (
                  filterEnquiryData.map((enquiry) => {
                    const isOpen = openAccordionId === enquiry._id;
                    const followUpDate = enquiry.followUp
                      ? new Date(enquiry.followUp)
                      : null;
                    const isOverdue = followUpDate && followUpDate < new Date();

                    return (
                      <div
                        key={enquiry._id}
                        className={`overflow-hidden rounded-xl border transition-all duration-200 ${
                          isOpen
                            ? "border-blue-300 bg-white shadow-md ring-1 ring-blue-100"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        {/* Accordion Header */}
                        <button
                          onClick={() => handleAccordionToggle(enquiry._id)}
                          className="flex w-full items-center justify-between p-4 text-left"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${isOpen ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}`}
                            >
                              {enquiry.studentName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-800">
                                {enquiry.studentName}
                              </h3>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="flex items-center gap-1 text-gray-500">
                                  <FaPhone className="text-[10px]" />{" "}
                                  {enquiry.phone}
                                </span>
                                {enquiry.followUp && (
                                  <span
                                    className={`rounded px-1.5 py-0.5 font-medium ${isOverdue ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                                  >
                                    {new Date(
                                      enquiry.followUp,
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <FaChevronDown
                            className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {/* Accordion Content */}
                        {isOpen && (
                          <div className="border-t border-gray-100 bg-gray-50/30 p-4">
                            {/* 1. Date Picker Section */}
                            <div className="mb-4 flex flex-col gap-3 rounded-lg border border-orange-100 bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="flex items-center gap-2 text-orange-800">
                                <FaCalendarAlt />
                                <span className="text-sm font-semibold">
                                  Next Follow-up:
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="date"
                                  value={selectedDate}
                                  onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                  }
                                  className="rounded-md border border-orange-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-orange-500 focus:outline-none"
                                />
                                <button
                                  onClick={() => handleSaveDate(enquiry._id)}
                                  disabled={updateDateMutation.isPending}
                                  className="rounded-md bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-700 disabled:opacity-50"
                                >
                                  {updateDateMutation.isPending
                                    ? "..."
                                    : "Update"}
                                </button>
                              </div>
                            </div>

                            {/* 2. Details Grid */}
                            <div className="mb-4 grid grid-cols-2 gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm text-gray-600 shadow-sm">
                              <div>
                                <span className="block text-xs font-semibold text-gray-400 uppercase">
                                  Instrument
                                </span>
                                <div className="mt-1 flex items-center gap-2 font-medium text-gray-800">
                                  <FaMusic className="text-blue-500" />{" "}
                                  {enquiry.instrument || "N/A"}
                                </div>
                              </div>
                              <div>
                                <span className="block text-xs font-semibold text-gray-400 uppercase">
                                  Status
                                </span>
                                <span className="mt-1 inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600">
                                  {enquiry.status || "New"}
                                </span>
                              </div>
                            </div>

                            {/* 3. Remarks Section (Timeline Style) */}
                            <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
                                <FaPaperPlane className="text-gray-400" />{" "}
                                Remarks History
                              </h4>

                              <div className="mb-4 max-h-40 space-y-3 overflow-y-auto pr-2">
                                {enquiry.remarks?.length > 0 ? (
                                  enquiry.remarks.map((rem, idx) => (
                                    <div key={idx} className="relative pl-4">
                                      {/* Timeline Line */}
                                      <div className="absolute top-1 left-0 h-full w-0.5 bg-gray-200"></div>
                                      <div className="rounded-r-lg rounded-bl-lg bg-gray-50 p-2.5 text-sm">
                                        <p className="text-gray-800">
                                          {rem.note}
                                        </p>
                                        <p className="mt-1 flex justify-end text-xs text-gray-400">
                                          - {rem.addedBy}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-center text-xs text-gray-400 italic">
                                    No remarks yet.
                                  </p>
                                )}
                              </div>

                              {/* Add Remark Input */}
                              <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3">
                                <input
                                  name="note"
                                  value={remarkForm.note}
                                  onChange={handleRemarkChange}
                                  placeholder="Type a new remark..."
                                  className="w-full rounded border border-gray-200 bg-white p-2 text-sm outline-none focus:border-blue-500"
                                />
                                <div className="flex items-center gap-2">
                                  <div className="relative flex-1">
                                    <FaUser className="absolute top-1/2 left-2.5 -translate-y-1/2 text-xs text-gray-400" />
                                    <input
                                      name="addedBy"
                                      value={remarkForm.addedBy}
                                      onChange={handleRemarkChange}
                                      placeholder="Added by..."
                                      className="w-full rounded border border-gray-200 bg-white py-1.5 pr-2 pl-8 text-sm outline-none focus:border-blue-500"
                                    />
                                  </div>
                                  <button
                                    onClick={() =>
                                      handleSubmitRemark(enquiry._id)
                                    }
                                    disabled={addRemarkMutation.isPending}
                                    className="flex items-center gap-1 rounded bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
                                  >
                                    {addRemarkMutation.isPending
                                      ? "..."
                                      : "Add"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center text-gray-400">
                    <FaSearch className="mb-2 text-3xl opacity-20" />
                    <p>No enquiries found matching your search.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden w-1/3 flex-col bg-gray-50 p-6 lg:flex">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 text-center">
              <h3 className="mb-2 font-bold text-blue-900">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded bg-white p-3 shadow-sm">
                  <p className="text-xs text-gray-500">Active</p>
                  <p className="text-xl font-bold text-blue-600">
                    {enquiries?.length || 0}
                  </p>
                </div>
                <div className="rounded bg-white p-3 shadow-sm">
                  <p className="text-xs text-gray-500">Overdue</p>
                  <p className="text-xl font-bold text-red-500">
                    {enquiries?.filter(
                      (e) => e.followUp && new Date(e.followUp) < new Date(),
                    ).length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-auto rounded-xl border border-gray-200 bg-white p-6 text-center text-gray-500 shadow-sm">
              <p className="text-sm">
                Select an enquiry from the list to view detailed history and
                manage follow-ups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EnquiryList;
