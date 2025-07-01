import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import PaymentForm from "../components/PaymentForm";

interface Payment {
  _id: string;
  student: {
    _id: string;
    studentName: string;
    studentsAddress?: string;
  };
  classesAttended: number;
  amount: number;
  status: string;
  paymentDate: string;
}

const PaymentPage = () => {
  const {
    data: payments,
    isLoading,
    isError,
  } = useQuery<Payment[]>({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/payment`,
      );
      return res.data;
    },
  });

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h2 className="mb-4 text-xl font-semibold">Add Payment</h2>
      <PaymentForm />
      <h2 className="mt-8 mb-4 text-xl font-semibold">Payment List</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Failed to fetch payments.</p>
      ) : (
        <div className="rounded bg-white p-4 shadow">
          {payments?.length === 0 ? (
            <p>No payments found.</p>
          ) : (
            payments?.map((payment) => (
              <div key={payment._id} className="border-b py-2">
                <p className="text-sm">
                  <strong className="text-blue-600">
                    {payment.student?.studentName || "Unknown Student"}
                  </strong>{" "}
                  paid ₹{payment.amount} on{" "}
                  {new Date(payment.paymentDate).toLocaleDateString()} -{" "}
                  <span className="text-gray-600 italic">{payment.status}</span>
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
