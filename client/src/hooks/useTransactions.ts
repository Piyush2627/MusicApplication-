import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/instrumentTransaction.api";
import type { InstrumentTransaction } from "../types/index.types";
import type { AxiosResponse } from "axios";

export const useTransactions = () => {
  const qc = useQueryClient();

  // ✅ Correctly typed useQuery
  const list = useQuery<AxiosResponse<InstrumentTransaction[]>, Error>({
    queryKey: ["transactions"],
    queryFn: api.fetchTransactions,
  });

  // ✅ createTransaction mutation
  const create = useMutation({
    mutationFn: api.createTransaction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });

  // ✅ returnInstrument mutation
  const returnInst = useMutation({
    mutationFn: api.returnInstrument,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });

  // ✅ deleteTransaction mutation
  const remove = useMutation({
    mutationFn: api.deleteTransaction,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });

  // ✅ feedback mutation
  const feedback = useMutation({
    mutationFn: (input: {
      id: string;
      feedback: { rating: number; comment: string };
    }) => api.addFeedback(input.id, input.feedback),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transactions"] }),
  });

  return { list, create, returnInst, remove, feedback };
};
