export type UserType = {
  _id?: string;
  userName: string;
  email: string;
  password: string;
  role: string;
  StudentsId?: StudentsType;
};

export type StudentsType = {
  StudentsStatus: string;
  target: any;
  _id: string;
  studentName: string;
  studentsEmail: string;
  studentsMobileNumber: number;
  studentsInstruments: string[];
  studentsJoiningDate?: Date;
  studentsBranch: string;
  studentsAge: number;
  studentsProfile: string;
  studentsAddress: {
    country?: string;
    city?: string;
    address?: string;
  };
};

export type AttendanceStudentType = {
  attendanceStudentsId: string;
  attendanceStatus: "Present" | "Absent" | "Late";
};

export type AttendanceType = {
  _id: string;
  attendanceDate: Date;
  attendanceRemark?: string;
  attendanceOfClass: string;
  attendanceRecord: AttendanceStudentType[];
};

export type ClassBatchType = {
  _id: string;
  batchName: string;
  batchInstructor: string;
  batchInstrument?: string;
  batchTiming: string;
  batchStudents: StudentsType[];
  batchStartDate?: string;
  batchBranch?: string;
  createdAt?: string;
  updatedAt?: string;
};
export interface RentalDetails {
  startDate?: string;
  endDate?: string;
  actualReturnDate?: string;
  isLate?: boolean;
  lateFee?: number;
}

export interface InstrumentTransaction {
  _id: string;
  transactionType: "purchase" | "rental";
  instrument: { name: string; price: number };
  paymentStatus: "pending" | "paid" | "failed";
  status: string;
  rentalDetails?: RentalDetails;
}
