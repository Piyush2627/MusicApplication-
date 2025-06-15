import React, { useId } from "react";
import { twMerge } from "tailwind-merge";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | React.ReactNode;
  containerClassName?: string;
}

function CustomInput({
  label,
  error,
  containerClassName,
  className,
  id: propId,
  type = "text",
  disabled,
  ...rest
}: CustomInputProps) {
  const autoId = useId();
  const inputId = propId || autoId;

  const baseInputStyles =
    "w-full bg-white text-sm text-zinc-800 placeholder:text-zinc-400 border rounded-xl px-4 py-2 transition-all duration-200 ease-in-out shadow-sm";

  const statefulInputStyles = error
    ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
    : "border-zinc-300 hover:border-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200";

  const disabledInputStyles = disabled
    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed border-zinc-200 shadow-none"
    : "";

  return (
    <div className={twMerge("w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-zinc-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        disabled={disabled}
        className={twMerge(
          baseInputStyles,
          statefulInputStyles,
          disabledInputStyles,
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-xs text-red-500"
          role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default CustomInput;
