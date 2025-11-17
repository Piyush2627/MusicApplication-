# SvaRa Music School Management System

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://music-application-mu.vercel.app/)

A comprehensive, web-based application designed to streamline and automate the administrative tasks of a music institution. It provides a centralized platform for managing student information, class schedules, attendance, instrument rentals, and financial records.

---

## 📖 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [✨ Key Features](#-key-features)
- [🛠️ Technology Stack](#-technology-stack)
- [🏗️ System Architecture](#-system-architecture)
- [🗄️ Database Schema](#-database-schema)
- [ Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [🔮 Future Enhancements](#-future-enhancements)

---

## 🎯 The Problem

Music schools often grapple with significant administrative challenges that hinder their growth and operational flow. Key issues include:

- **Manual Data Management:** Relying on paper-based systems or spreadsheets for tracking student details, attendance, and payments is time-consuming and highly susceptible to errors.
- **Inefficient Scheduling:** The complexity of managing multiple class batches and coordinating teacher schedules often leads to conflicts and inefficiencies.
- **Fragmented Communication:** Communicating important updates, schedule changes, and payment reminders to a large body of students and parents is often difficult and disorganized.
- **Lack of Centralization:** With information scattered across different documents and platforms, it becomes challenging to get a clear, real-time overview of the school's operations.

## 💡 The Solution

The SvaRa Music School Management System addresses these problems by offering a single, unified platform that serves as the central hub for all administrative activities. The solution provides:

- **Automation:** Key processes such as attendance tracking, fee management, and scheduling are automated to save time and reduce human error.
- **Centralized Database:** All student, batch, and financial data is stored securely in one location, ensuring data integrity and easy access.
- **Role-Based Access Control:** The system features separate, secure dashboards for administrators and students.
- **Accessibility:** As a web-based application, the system is accessible from any device with an internet connection.

---

## ✨ Key Features

- **Student Management:** Add, view, edit, and search for students with detailed profiles.
- **Class Batch Management:** Create and manage class batches, assign teachers, and set schedules.
- **Attendance Tracking:** Mark and monitor student attendance for each batch.
- **Instrument Rental Management:** Track instrument rentals, including start and end dates.
- **Enquiry & Payment Tracking:** Log inquiries from prospective students and record fee payments with history.

---

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite, React Router, CSS
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB

---

## 🏗️ System Architecture

The application follows a classic **Client-Server Architecture**:

- **Client (Frontend):** A Single Page Application (SPA) built with React that handles the user interface and communicates with the server via a RESTful API.
- **Server (Backend):** A Node.js/Express application that exposes API endpoints, handles business logic, and communicates with the MongoDB database.

---

## 🗄️ Database Schema

Since this project uses MongoDB, a NoSQL database, it follows a document-based structure instead of relational tables. However, to better understand the relationships between data entities, we can represent the schema in a relational format.

### **Students Collection**

Corresponds to a `students` table.

| Column Name       | Data Type | Constraints      | Description                        |
| ----------------- | --------- | ---------------- | ---------------------------------- |
| `_id`             | ObjectId  | PRIMARY KEY      | Unique identifier for the student. |
| `name`            | String    | Required         | Full name of the student.          |
| `email`           | String    | Unique, Required | Student's email address.           |
| `phone`           | String    |                  | Student's contact number.          |
| `address`         | String    |                  | Student's physical address.        |
| `enrollment_date` | Date      | Default: `now`   | The date the student was enrolled. |

### **Teachers Collection**

Corresponds to a `teachers` table.

| Column Name      | Data Type | Constraints      | Description                                        |
| ---------------- | --------- | ---------------- | -------------------------------------------------- |
| `_id`            | ObjectId  | PRIMARY KEY      | Unique identifier for the teacher.                 |
| `name`           | String    | Required         | Full name of the teacher.                          |
| `email`          | String    | Unique, Required | Teacher's email address.                           |
| `phone`          | String    |                  | Teacher's contact number.                          |
| `specialization` | String    |                  | The instrument or area the teacher specializes in. |

### **ClassBatch Collection**

Corresponds to a `class_batches` table.

| Column Name  | Data Type       | Constraints            | Description                                             |
| ------------ | --------------- | ---------------------- | ------------------------------------------------------- |
| `_id`        | ObjectId        | PRIMARY KEY            | Unique identifier for the class batch.                  |
| `batch_name` | String          | Required               | Name of the batch (e.g., "Guitar Beginners - Mon 5PM"). |
| `teacher_id` | ObjectId        | FOREIGN KEY (Teachers) | Reference to the teacher for this batch.                |
| `students`   | Array[ObjectId] | FOREIGN KEY (Students) | List of students enrolled in this batch.                |
| `schedule`   | Object          |                        | Contains day and time for the class.                    |

### **Attendance Collection**

Corresponds to an `attendance` table.

| Column Name  | Data Type | Constraints                         | Description                                     |
| ------------ | --------- | ----------------------------------- | ----------------------------------------------- |
| `_id`        | ObjectId  | PRIMARY KEY                         | Unique identifier for the attendance record.    |
| `student_id` | ObjectId  | FOREIGN KEY (Students)              | The student whose attendance is being marked.   |
| `batch_id`   | ObjectId  | FOREIGN KEY (ClassBatch)            | The batch for which attendance is being marked. |
| `date`       | Date      | Required                            | The date of the class.                          |
| `status`     | String    | Required, Enum("Present", "Absent") | The attendance status.                          |

### **Payments Collection**

Corresponds to a `payments` table.

| Column Name    | Data Type | Constraints            | Description                          |
| -------------- | --------- | ---------------------- | ------------------------------------ |
| `_id`          | ObjectId  | PRIMARY KEY            | Unique identifier for the payment.   |
| `student_id`   | ObjectId  | FOREIGN KEY (Students) | The student making the payment.      |
| `amount`       | Number    | Required               | The amount paid.                     |
| `payment_date` | Date      | Default: `now`         | The date the payment was made.       |
| `for_month`    | String    |                        | The month for which the fee is paid. |

### **InstrumentRentals Collection**

Corresponds to an `instrument_rentals` table.

| Column Name         | Data Type | Constraints            | Description                              |
| ------------------- | --------- | ---------------------- | ---------------------------------------- |
| `_id`               | ObjectId  | PRIMARY KEY            | Unique identifier for the rental record. |
| `student_id`        | ObjectId  | FOREIGN KEY (Students) | The student renting the instrument.      |
| `instrument_name`   | String    | Required               | The name of the rented instrument.       |
| `rental_start_date` | Date      | Required               | The start date of the rental period.     |
| `rental_end_date`   | Date      |                        | The end date of the rental period.       |

### **Enquiries Collection**

Corresponds to an `enquiries` table.

| Column Name | Data Type | Constraints              | Description                             |
| ----------- | --------- | ------------------------ | --------------------------------------- |
| `_id`       | ObjectId  | PRIMARY KEY              | Unique identifier for the enquiry.      |
| `name`      | String    | Required                 | Name of the person making the enquiry.  |
| `email`     | String    | Required                 | Email of the person making the enquiry. |
| `phone`     | String    |                          | Contact number of the person.           |
| `status`    | String    | Enum("New", "Contacted") | The status of the enquiry.              |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB instance (local or a cloud service like MongoDB Atlas)

### Backend Setup (`/server`)

1.  Navigate to the server directory: `cd server`
2.  Install dependencies: `npm install`
3.  Create a `.env` file and add your environment variables (e.g., `MONGO_URI`, `PORT`).
4.  Start the development server: `npm run dev`

### Frontend Setup (`/client`)

1.  Navigate to the client directory: `cd client`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`
4.  Open your browser and go to `http://localhost:5173`.

---

## 📁 Project Structure

The project is organized into a monorepo structure with two main directories:

```
/
├── client/         # Frontend React Application
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       └── router/
└── server/         # Backend Node.js API
    └── src/
        ├── controllers/
        ├── db/
        ├── model/
        └── router/
```

---

## 🔮 Future Enhancements

- **Online Payment Gateway:** Integrate Stripe or PayPal for direct online fee payments.
- **Parent Portal:** A dedicated login for parents to view their child's progress.
- **Reporting & Analytics:** Generate detailed reports on revenue, attendance, and student performance.
- **Automated Reminders:** Send automated SMS or email reminders for payments and classes.
- **Mobile Application:** Develop a native mobile app for an enhanced user experience.
