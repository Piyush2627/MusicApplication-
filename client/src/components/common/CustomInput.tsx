import React, { useId } from "react";
import { twMerge } from "tailwind-merge";
import { type IconType } from "react-icons";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | React.ReactNode;
  containerClassName?: string;
  Icon?: IconType;
}

function CustomInput({
  label,
  error,
  containerClassName,
  className,
  id: propId,
  type = "text",
  disabled,
  Icon,
  ...rest
}: CustomInputProps) {
  const autoId = useId();
  const inputId = propId || autoId;

  const baseInputStyles =
    "w-full bg-white text-sm text-zinc-800 placeholder:text-zinc-400 focus:ring-0 border rounded-md px-4 py-3 transition-all duration-200 ease-in-out shadow-sm";

  const statefulInputStyles = error
    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
    : "border-zinc-300 hover:border-zinc-400 focus:border-indigo-500 focus:ring-0 focus:ring-indigo-200";

  const disabledInputStyles = disabled
    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200 shadow-none"
    : "";

  return (
    <div className={twMerge("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-zinc-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="text-gray-400" />
          </div>
        )}
        <input
          type={type}
          id={inputId}
          disabled={disabled}
          className={twMerge(
            baseInputStyles,
            statefulInputStyles,
            disabledInputStyles,
            Icon ? "pl-10" : "",
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
      </div>
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-xs text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default CustomInput;
