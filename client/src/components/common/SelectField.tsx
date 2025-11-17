
import { type ChangeEvent } from "react";
import { type IconType } from "react-icons";

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  className = "",
  Icon,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  className?: string;
  Icon?: IconType;
}) => (
  <div className={className}>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="text-gray-400" />
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${Icon ? "pl-10" : ""}`}>
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default SelectField;
