import { FaAlignRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  type FC,
} from "react";
import { Link } from "react-router-dom";

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: true });

interface SidebarProps {
  children: ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ children }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <aside className="h-screen bg-white dark:bg-black">
      <nav className="flex h-full flex-col justify-between">
        <div className="flex items-center justify-between p-4 pb-2">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="rounded p-2 text-gray-600 hover:bg-gray-100 dark:bg-black"
          >
            {expanded ? <FaArrowLeft /> : <FaAlignRight />}
          </button>
        </div>
        <div className="relative grow rounded-xl">
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 px-3">{children}</ul>
          </SidebarContext.Provider>
        </div>

        <div
          className={`flex items-center justify-between overflow-hidden transition-all ${
            expanded ? "ml-3 w-52" : "w-0"
          } `}
        >
          <div className="leading-4">
            <h4 className="font-semibold">SvaRa Music</h4>
            <span className="text-xs text-gray-600">svaraMusic@gmail.com</span>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

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
        className={`group flex items-center rounded-md px-3 py-2 font-medium transition-colors ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "text-gray-600 hover:bg-indigo-50"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
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
            className={`invisible absolute left-full z-50 ml-1 -translate-x-3 rounded-md bg-zinc-100 px-2 py-1 text-sm whitespace-nowrap text-zinc-600 opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
};
