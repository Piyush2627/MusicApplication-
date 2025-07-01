import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Rental {
  _id: string;
  instrumentName: string;
  instrumentType: string;
  rentedBy: string;
  rentedByType: "Student" | "Other";
  rentAmount: number;
  paymentStatus: "paid" | "pending";
  rentDate: string;
  returnDate: string;
}

const InstrumentRentalList: React.FC = () => {
  const queryClient = useQueryClient();

  // Fetch rentals
  const { data, isLoading, isError, error } = useQuery<Rental[]>({
    queryKey: ["rentals"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/instrument`,
      );
      return response.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/instrument/${id}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
  });

  // Mark as paid mutation
  const markPaidMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/instrument/${id}`,
        {
          paymentStatus: "paid",
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
  });

  if (isLoading)
    return <p className="mt-6 text-center text-blue-500">Loading rentals...</p>;

  if (isError)
    return (
      <p className="mt-6 text-center text-red-500">
        Error: {(error as Error).message}
      </p>
    );

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Instrument Rentals
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left text-sm uppercase">
              <th className="p-3">Instrument</th>
              <th className="p-3">Type</th>
              <th className="p-3">Rented By</th>
              <th className="p-3">User Type</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Rent Date</th>
              <th className="p-3">Return Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((rental) => (
              <tr key={rental._id} className="border-t text-sm">
                <td className="p-3">{rental.instrumentName}</td>
                <td className="p-3">{rental.instrumentType}</td>
                <td className="p-3">{rental.rentedBy}</td>
                <td className="p-3">{rental.rentedByType}</td>
                <td className="p-3">₹{rental.rentAmount.toFixed(2)}</td>
                <td
                  className={`p-3 ${
                    rental.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {rental.paymentStatus}
                </td>
                <td className="p-3">
                  {new Date(rental.rentDate).toLocaleDateString()}
                </td>
                <td className="p-3">
                  {new Date(rental.returnDate).toLocaleDateString()}
                </td>
                <td className="space-x-2 p-3">
                  {rental.paymentStatus === "pending" && (
                    <button
                      onClick={() => markPaidMutation.mutate(rental._id)}
                      className="rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
                    >
                      Mark Paid
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(rental._id)}
                    className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {data?.length === 0 && (
              <tr>
                <td colSpan={9} className="p-4 text-center text-gray-500">
                  No rentals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InstrumentRentalList;
