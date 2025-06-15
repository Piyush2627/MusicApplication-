import { Outlet } from "react-router-dom";
import Sidebar, { SidebarItem } from "../components/common/Sidebar";
import { MdSpaceDashboard, MdPersonAddAlt1, MdSettings } from "react-icons/md";
import {
  FaFingerprint,
  FaAddressCard,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaGuitar,
} from "react-icons/fa";
import { BsFillInboxesFill, BsCardChecklist } from "react-icons/bs";
function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="h-screen flex-shrink-0 scroll-smooth bg-white shadow-lg">
        <Sidebar>
          <SidebarItem icon={<MdSpaceDashboard />} text="Dashboard" link="/" />

          <SidebarItem
            icon={<MdPersonAddAlt1 />}
            text="Add Student"
            link="/add-Students"
          />
          <SidebarItem
            icon={<FaAddressCard />}
            text="Enquiries"
            link="/enquiry"
          />

          <SidebarItem
            icon={<BsFillInboxesFill />}
            text="Batches"
            link="/batch"
          />
          <SidebarItem
            icon={<FaFingerprint />}
            text="Attendance"
            link="/attendanceDashboard"
          />
          <SidebarItem
            icon={<FaAddressCard />}
            text="Student Profiles"
            link="/students/profiles"
          />
          <SidebarItem
            icon={<BsCardChecklist />}
            text="Assessments"
            link="/assessments"
          />
          <SidebarItem
            icon={<FaChalkboardTeacher />}
            text="Instructors"
            link="/instructors"
          />
          <SidebarItem
            icon={<FaGuitar />}
            text="Instruments"
            link="/instruments"
          />

          <SidebarItem
            icon={<FaMoneyBillWave />}
            text="Billing & Payments"
            link="/billing"
          />

          <SidebarItem icon={<MdSettings />} text="Settings" link="/settings" />
        </Sidebar>
      </div>
      <div className="h-screen flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
