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
import TopNavBar from "../components/common/TopNavBar";
function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <div className="h-screen flex-shrink-0 scroll-smooth bg-white shadow-lg">
        <Sidebar>
          <SidebarItem icon={<MdSpaceDashboard />} text="Dashboard" link="/admin/dashboard" />

          <SidebarItem
            icon={<MdPersonAddAlt1 />}
            text="Add Student"
            link="/admin/add-Students"
          />
          <SidebarItem
            icon={<FaAddressCard />}
            text="Enquiries"
            link="/admin/enquiry"
          />

          <SidebarItem
            icon={<BsFillInboxesFill />}
            text="Batches"
            link="/admin/batch"
          />
          <SidebarItem
            icon={<FaFingerprint />}
            text="Attendance"
            link="/admin/attendanceDashboard"
          />
          <SidebarItem
            icon={<FaAddressCard />}
            text="Student Profiles"
            link="/admin/studentsProfiles"
          />
          <SidebarItem
            icon={<BsCardChecklist />}
            text="Assessments"
            link="/admin/assessments"
          />
          <SidebarItem
            icon={<FaChalkboardTeacher />}
            text="Instructors"
            link="/admin/instructors"
          />
          <SidebarItem
            icon={<FaGuitar />}
            text="Instruments"
            link="/admin/instrument"
          />

          <SidebarItem
            icon={<FaMoneyBillWave />}
            text="Billing & Payments"
            link="/admin/payment"
          />

          <SidebarItem icon={<MdSettings />} text="Settings" link="/admin/settings" />
        </Sidebar>
      </div>
      <div className="h-screen flex-1 overflow-y-auto">
        <TopNavBar />
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
