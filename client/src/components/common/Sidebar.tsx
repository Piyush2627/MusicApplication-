// Sidebar.tsx
import { FaAlignRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

import logo from "../../assets/images/WhiteLogoBgRemoved.png";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type FC,
} from "react";
import { Link } from "react-router-dom";

// Define the type of the context value
interface SidebarContextType {
  expanded: boolean;
}

// Provide a default context (you can use `undefined` if you add checks later)
const SidebarContext = createContext<SidebarContextType>({ expanded: true });

// Props for Sidebar
interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="h-screen">
      <nav className="flex h-full flex-col justify-between border-r border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4 pb-2">
          <img
            src={logo}
            alt="Logo"
            className={`size-24 overflow-hidden transition-all ${
              expanded ? "w-24" : "w-0"
            }`}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="rounded-lg bg-gray-50 p-1.5 hover:bg-gray-100"
          >
            {expanded ? <FaArrowLeft /> : <FaAlignRight />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        {/* <img src={profile} alt="Profile" className="w-10 h-10 rounded-md" /> */}
        <div
          className={`flex items-center justify-between overflow-hidden transition-all ${
            expanded ? "ml-3 w-52" : "w-0"
          } `}
        >
          <div className="leading-4">
            <h4 className="font-semibold">SvaRa Music</h4>
            <span className="text-xs text-gray-600">svaraMusic@gmail.com</span>
          </div>
          {/* Replace with an icon if needed */}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

// Props for SidebarItem
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  link: string;
  active?: boolean;
  alert?: boolean;
}

export const SidebarItem: FC<SidebarItemProps> = ({
  icon,
  text,
  active = false,
  alert = false,
  link,
}) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <Link to={link}>
      <li
        className={`group relative my-1 flex cursor-pointer items-center rounded-md px-3 py-2 font-medium transition-colors ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "text-gray-600 hover:bg-indigo-50"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "ml-3 w-52" : "w-0"
          }`}
        >
          {text}
        </span>
        {alert && (
          <div
            className={`absolute right-2 h-2 w-2 rounded bg-indigo-400 ${
              expanded ? "" : "top-2"
            }`}
          ></div>
        )}

        {!expanded && (
          <div
            className={`invisible absolute left-full z-50 ml-6 -translate-x-3 rounded-md bg-indigo-100 px-2 py-1 text-sm text-indigo-800 opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
};
