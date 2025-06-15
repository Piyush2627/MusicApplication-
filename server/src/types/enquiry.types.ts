export interface EnquiryInput {
  studentName: string;
  email: string;
  phone: string;
  instrument: string;
  preferredTime: string;
  message?: string;
  status?: "pending" | "contacted" | "enrolled";
}
