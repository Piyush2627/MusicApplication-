import React, { useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const AddInstrumentRental: React.FC = () => {
  const [formData, setFormData] = useState({
    instrumentName: "",
    instrumentType: "",
    rentedBy: "",
    rentedByType: "",
    rentAmount: 1200,
    paymentStatus: "pending", // must match schema exactly
    rentDate: new Date().toISOString().split("T")[0],
    returnDate: new Date().toISOString().split("T")[0],
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/instrument`,
        {
          ...formData,
          rentAmount: Number(formData.rentAmount),
          rentDate: new Date(formData.rentDate),
          returnDate: new Date(formData.returnDate),
        },
      );
      return response.data;
    },
    onSuccess: () => {
      alert("Instrument rented successfully!");
      setFormData({
        instrumentName: "",
        instrumentType: "",
        rentedBy: "",
        rentedByType: "",
        rentAmount: 0,
        paymentStatus: "pending",
        rentDate: new Date().toISOString().split("T")[0],
        returnDate: new Date().toISOString().split("T")[0],
      });
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gray-200 bg-white/70 p-6 shadow-xl backdrop-blur-md">
      <h2 className="mb-6 text-center text-2xl font-semibold text-indigo-700">
        Add Instrument Rental
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Instrument Name
          </label>
          <input
            type="text"
            name="instrumentName"
            value={formData.instrumentName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 text-sm"
            placeholder="e.g. Guitar"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Instrument Type
          </label>
          <input
            type="text"
            name="instrumentType"
            value={formData.instrumentType}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 text-sm"
            placeholder="e.g. String"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Rented By (User ID)
          </label>
          <input
            type="text"
            name="rentedBy"
            value={formData.rentedBy}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 text-sm"
            placeholder="User ID or Name"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Renter Type
          </label>
          <select
            name="rentedByType"
            value={formData.rentedByType}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 text-sm"
          >
            <option value="">Select Option</option>
            <option value="Student">Student</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Rent Date
            </label>
            <input
              type="date"
              name="rentDate"
              value={formData.rentDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-gray-300 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Return Date
            </label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-gray-300 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Rent Amount (₹)
          </label>
          <input
            type="number"
            name="rentAmount"
            value={formData.rentAmount}
            onChange={handleChange}
            required
            className="w-full rounded-lg border-gray-300 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Payment Status
          </label>
          <select
            name="paymentStatus"
            value={formData.paymentStatus}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 text-sm"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {mutation.isPending ? "Submitting..." : "Submit Rental"}
        </button>
      </form>
    </div>
  );
};

export default AddInstrumentRental;
