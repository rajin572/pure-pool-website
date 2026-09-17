"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../../button";
import { Calendar } from "../../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value: Date | undefined;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
  formatString?: string;
  disablePast?: boolean; // Add disablePast prop
  Layout?: "dropdown" | "label" | "dropdown-years" | "dropdown-months"; //  layout prop
  triggerClassName?: string;
  displayText?: string;
  showText?: boolean;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  formatString = "PPP", // Default to 'PPP' format, you can customize
  disablePast = false, // Default to false
  Layout = "dropdown", // Default caption layout
  triggerClassName,
  displayText,
  showText = true,
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight to ignore time part

  return (
    <div className={cn("w-full p-6 flex justify-center", className)}>
      <Popover>
        <PopoverTrigger>
          <Button
            variant="outline"
            data-empty={!value}
            className={cn("data-[empty=true]:text-muted-foreground justify-start text-left font-normal", triggerClassName)}
          >
            <CalendarIcon />
            {showText && (
              displayText ? <span>{displayText}</span> : (value ? format(value, formatString) : <span className="placeholder:text-base-color/50!">{placeholder}</span>)
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            required={true}
            mode="single"
            selected={value}
            onSelect={onChange}
            captionLayout={Layout}
            disabled={disablePast ? (date) => {
              // Disable dates before today (ignoring time)
              const compareDate = new Date(date);
              compareDate.setHours(0, 0, 0, 0);
              return compareDate < today;
            } : undefined} // Disable past dates if disablePast is true
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

