import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

interface enquiryInput {
  studentName: string;
  email: string;
  phone: string;
  instrument: string;
  preferredTime: string;
  message: string;
}

//localhost:3000/v1/api/enquiries

function EnquiryForm() {
  const queryClient = useQueryClient();
  const [isFormInputData, setIsFormInputData] = useState<enquiryInput>({
    studentName: "",
    email: "",
    phone: "",
    instrument: "",
    preferredTime: "",
    message: "",
  });
  const mutation = useMutation({
    mutationFn: (newEnquiry: enquiryInput) =>
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/enquiries`, newEnquiry),

    onSuccess: () => {
      setIsFormInputData({
        studentName: "",
        email: "",
        phone: "",
        instrument: "",
        preferredTime: "",
        message: "",
      });
      queryClient.invalidateQueries({ queryKey: ["enquiries"] });
    },
  });

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFormInputData({ ...isFormInputData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(isFormInputData);
    toast.success("Enquiry Added");
  };

  return (
    <>
      <div className="mt-5">
        <Toaster position="top-right" />
        <form onSubmit={handleSubmit} className="">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="studentName"
              onChange={handleChangeInput}
              value={isFormInputData.studentName}
              type="text"
              placeholder="Name"
              className="w-full rounded-lg border border-indigo-500 px-4 py-3 text-slate-200 placeholder-slate-500 transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <input
              name="email"
              onChange={handleChangeInput}
              value={isFormInputData.email}
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border border-indigo-500 px-4 py-3 text-slate-200 placeholder-slate-500 transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <input
              name="instrument"
              onChange={handleChangeInput}
              value={isFormInputData.instrument}
              type="text"
              placeholder="Instrument"
              className="w-full rounded-lg border border-indigo-500 px-4 py-3 text-slate-200 placeholder-slate-500 transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <input
              name="phone"
              onChange={handleChangeInput}
              value={isFormInputData.phone}
              type="text"
              placeholder="Phone"
              className="w-full rounded-lg border border-indigo-500 px-4 py-3 text-slate-200 placeholder-slate-500 transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <input
              name="preferredTime"
              onChange={handleChangeInput}
              value={isFormInputData.preferredTime}
              type="text"
              placeholder="Preferred Time"
              className="w-full rounded-lg border border-indigo-500 px-4 py-3 text-slate-200 placeholder-slate-500 transition-all duration-300 outline-none focus:ring-2 focus:ring-indigo-500/40"
            />
            <div>
              <button
                type="submit"
                className="*: rounded bg-violet-500 p-2 px-4 font-bold text-white"
              >
                Submit Enquiry
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
export default EnquiryForm;
