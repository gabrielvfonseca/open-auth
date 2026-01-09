"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, id, ...props }, ref) => {
    const uniqueId = React.useId();
    const inputId = id || uniqueId;

    return (
      <div className="space-y-2">
        {label && (
          <label
            className="block font-medium text-gray-700 text-sm dark:text-gray-300"
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <input
          className={cn(
            "flex h-11 w-full rounded-lg border bg-white px-4 py-2 text-sm transition-all",
            "placeholder:text-gray-400",
            "focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "dark:border-gray-700 dark:bg-gray-900 dark:text-white",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 dark:border-gray-700",
            className
          )}
          id={inputId}
          ref={ref}
          type={type}
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
