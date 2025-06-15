import { useState } from "react";
import type { InstrumentTransaction } from "../types/index.types";
import { useTransactions } from "../hooks/useTransactions";

export default function FeedbackModal({ tx }: { tx: InstrumentTransaction }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { feedback } = useTransactions();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-green-600 hover:underline"
      >
        Feedback
      </button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20">
          <div className="w-1/3 rounded bg-white p-6 shadow">
            <h3 className="mb-4 font-semibold">Add Feedback</h3>
            <label className="mb-2 block">
              Rating:
              <input
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(+e.target.value)}
                className="ml-2 border p-1"
              />
            </label>
            <label className="mb-2 block">
              Comment:
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-1"
              />
            </label>
            <button
              onClick={() => setOpen(false)}
              className="mr-2 rounded border px-3 py-1"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                feedback.mutate({ id: tx._id, feedback: { rating, comment } });
                setOpen(false);
              }}
              className="rounded bg-green-600 px-3 py-1 text-white"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
