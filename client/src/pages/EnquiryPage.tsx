import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import EnquiryList from "../components/EnquiryList";
import CustomInput from "../components/common/CustomInput";

interface EnquiryInput {
  studentName: string;
  email: string;
  phone: string;
  instrument: string;
  preferredTime: string;
  message?: string;
}

const EnquiryPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<EnquiryInput>({
    studentName: "",
    email: "",
    phone: "",
    instrument: "",
    preferredTime: "",
    message: "",
  });

  const mutation = useMutation({
    mutationFn: (newEnquiry: EnquiryInput) =>
      axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/enquiries`,
        newEnquiry,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enquiries"] }); // 🔄 refetch list
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="p-6">
      <h2 className="mb-4 text-xl font-semibold">Create Enquiry</h2>
      {mutation.isSuccess && (
        <div className="mb-3 rounded bg-green-100 px-4 py-2 text-green-700">
          Enquiry submitted successfully!
        </div>
      )}
      {mutation.isError && (
        <div className="mb-3 rounded bg-red-100 px-4 py-2 text-red-700">
          Failed to submit enquiry.
        </div>
      )}
      <div className="flex justify-between space-x-6">
        <div className="w-1/2">
          <div>
            <h1 className="text-4xl font-semibold">Today's Enquiry</h1>
            <p>All the enquiry from toda's lit</p>
          </div>
          <EnquiryList />
        </div>
        <div className="w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              value={formData.studentName}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            />
            <input
              type="text"
              name="instrument"
              placeholder="Instrument"
              value={formData.instrument}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            />
            <input
              type="text"
              name="preferredTime"
              placeholder="Preferred Time"
              value={formData.preferredTime}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            />
            <textarea
              name="message"
              placeholder="Message (optional)"
              value={formData.message}
              onChange={handleChange}
              className="w-full rounded border p-2"
            ></textarea>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnquiryPage;
