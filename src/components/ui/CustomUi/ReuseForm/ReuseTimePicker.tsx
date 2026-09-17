"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "../../button";
import { Popover, PopoverContent, PopoverTrigger } from "../../popover";
import { cn } from "@/lib/utils";

// Define possible props for the component
interface DateTimePickerProps {
    selectedDate?: Date | undefined; // Full Date (e.g., 2025/29/12)
    value: Date | undefined; // Time value (e.g., 10:30 AM)
    onChange: (date: Date) => void; // Callback to update the time
    formatString?: string; // Optional custom format string
    timeFormat?: "12-hour" | "24-hour"; // Choose between 12-hour and 24-hour format
    placeholder?: string; // Placeholder text
    disablePast?: boolean; // Disable past times if today
    disable?: boolean; // Disable the popover if true
    triggerClassName?: string; // Custom button styling
    className?: string; // Custom container styling
}

export function ReuseTimePicker({
    selectedDate,
    value,
    onChange,
    formatString = "hh:mm aa", // Default to 12-hour format (without date)
    timeFormat = "12-hour", // Default to 12-hour format
    placeholder = "Select a time", // Default placeholder
    disablePast = false, // Default disablePast to false
    disable = false, // Default to false (popover enabled)
    triggerClassName,
    className,
}: DateTimePickerProps) {
    // Get today's date and current time to disable past times
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to midnight to compare only the date part
    const currentTime = new Date(); // Current time to compare with

    // Get current AM/PM based on value or current time
    const getCurrentAMPM = (): "AM" | "PM" => {
        if (value) {
            return value.getHours() >= 12 ? "PM" : "AM";
        }
        return currentTime.getHours() >= 12 ? "PM" : "AM";
    };

    const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(getCurrentAMPM);
    const timeAMPMFormat = value ? (value.getHours() >= 12 ? "PM" : "AM") : selectedPeriod;
    const [open, setOpen] = useState(false);

    const popoverContentRef = useRef<HTMLDivElement>(null);
    const hoursRef = useRef<HTMLDivElement>(null);
    const minutesRef = useRef<HTMLDivElement>(null);

    // Stop wheel and touchmove events from bubbling to document where Radix Dialog's RemoveScroll prevents scrolling
    useEffect(() => {
        const el = popoverContentRef.current;
        if (!el) return;

        const stopScrollPropagation = (e: Event) => {
            e.stopPropagation();
        };

        el.addEventListener("wheel", stopScrollPropagation, { passive: false });
        el.addEventListener("touchmove", stopScrollPropagation, { passive: false });

        return () => {
            el.removeEventListener("wheel", stopScrollPropagation);
            el.removeEventListener("touchmove", stopScrollPropagation);
        };
    }, [open]);

    // Scroll selected hour and minute into view when opened or changed
    useEffect(() => {
        if (!open) return;
        const timer = setTimeout(() => {
            if (hoursRef.current) {
                const activeHour = hoursRef.current.querySelector('[data-selected="true"]');
                if (activeHour) {
                    (activeHour as HTMLElement).scrollIntoView({ block: "center", behavior: "auto" });
                }
            }
            if (minutesRef.current) {
                const activeMinute = minutesRef.current.querySelector('[data-selected="true"]');
                if (activeMinute) {
                    (activeMinute as HTMLElement).scrollIntoView({ block: "center", behavior: "auto" });
                }
            }
        }, 30);
        return () => clearTimeout(timer);
    }, [open, value, timeAMPMFormat]);

    const handleTimeChange = (type: "hour" | "minute" | "ampm", changeValue: string) => {
        if (type === "ampm") {
            const newPeriod = changeValue as "AM" | "PM";
            setSelectedPeriod(newPeriod);
            if (!value) return;

            const newDate = new Date(value);
            const hours = newDate.getHours();
            if (newPeriod === "AM" && hours >= 12) {
                newDate.setHours(hours - 12);
            } else if (newPeriod === "PM" && hours < 12) {
                newDate.setHours(hours + 12);
            }
            onChange(newDate);
            return;
        }

        const baseDate = value || selectedDate || new Date();
        const newDate = new Date(baseDate);

        if (!value && timeFormat === "12-hour") {
            const currentHours = newDate.getHours();
            if (timeAMPMFormat === "PM" && currentHours < 12) {
                newDate.setHours(currentHours + 12);
            } else if (timeAMPMFormat === "AM" && currentHours >= 12) {
                newDate.setHours(currentHours - 12);
            }
        }

        if (type === "hour") {
            const hour = parseInt(changeValue, 10);
            // Handle 12-hour format conversion
            if (timeFormat === "12-hour") {
                const currentPeriod = timeAMPMFormat;
                if (currentPeriod === "PM") {
                    // PM: 12 stays 12, 1-11 becomes 13-23
                    newDate.setHours(hour === 12 ? 12 : hour + 12);
                } else {
                    // AM: 12 becomes 0, 1-11 stays 1-11
                    newDate.setHours(hour === 12 ? 0 : hour);
                }
            } else {
                newDate.setHours(hour);
            }
        } else if (type === "minute") {
            newDate.setMinutes(parseInt(changeValue, 10));
        }

        onChange(newDate); // Pass the new date back to the parent
    };

    // Function to disable past times if today
    const isTimeDisabled = (hour: number, minute: number, period?: "AM" | "PM", isHourCheck: boolean = false) => {
        if (disablePast && selectedDate && selectedDate.toDateString() === today.toDateString()) {
            const currentHour = currentTime.getHours();
            const currentMinute = currentTime.getMinutes();

            // For 12-hour format
            if (timeFormat === "12-hour" && period) {
                // Convert display hour to 24-hour format
                let hour24 = hour;
                if (period === "PM" && hour !== 12) {
                    hour24 = hour + 12;
                } else if (period === "AM" && hour === 12) {
                    hour24 = 0;
                }

                // If checking hour selection, only disable if hour is strictly before current hour
                if (isHourCheck) {
                    return hour24 < currentHour;
                }

                // If selected hour is before current hour, disable it
                if (hour24 < currentHour) {
                    return true;
                }

                // If selected hour is the same as current hour, check minutes
                if (hour24 === currentHour && minute < currentMinute) {
                    return true;
                }

                return false;
            }

            // For 24-hour format
            // If checking hour selection, only disable if hour is strictly before current hour
            if (isHourCheck) {
                return hour < currentHour;
            }

            // If selected hour is before current hour, disable it
            if (hour < currentHour) {
                return true;
            }

            // If selected hour is the same as current hour, check minutes
            if (hour === currentHour && minute < currentMinute) {
                return true;
            }

            return false;
        }
        return false;
    };

    if (disable) {
        return null; // Return nothing if popover is disabled
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                type="button"
                className={cn("inline-flex items-center justify-between w-fit pl-3 pr-3 py-2 text-left font-normal border rounded-md text-sm bg-white shadow-xs hover:bg-accent cursor-pointer", triggerClassName, className)}
            >
                {value ? (
                    format(value, formatString) // Only show time without date
                ) : (
                    <span className="placeholder:text-base-color/50!">{placeholder}</span>
                )}
                <CalendarIcon className="ml-2 h-4 w-4 opacity-50 shrink-0" />
            </PopoverTrigger>
            <PopoverContent
                ref={popoverContentRef}
                className="w-auto p-0 z-50"
                onWheel={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}
                onTouchMove={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                }}
            >
                <div className="flex flex-row py-3 divide-x select-none">
                    {/* Hours list */}
                    <div
                        ref={hoursRef}
                        className="w-16 h-[250px] overflow-y-auto overflow-x-hidden p-1.5 flex flex-col gap-1 overscroll-contain"
                        style={{ scrollbarWidth: "thin" }}
                    >
                        {Array.from({ length: timeFormat === "12-hour" ? 12 : 24 }, (_, i) => i).map(
                            (hour) => {
                                const displayHour = timeFormat === "12-hour" && hour === 0 ? 12 : hour;
                                const isSelected = value &&
                                    (timeFormat === "12-hour"
                                        ? (value.getHours() % 12 === 0 ? 12 : value.getHours() % 12) === displayHour
                                        : value.getHours() === hour);
                                return (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        data-selected={isSelected ? "true" : undefined}
                                        variant={isSelected ? "default" : "ghost"}
                                        className="w-full shrink-0 aspect-square text-sm font-medium"
                                        onClick={() => handleTimeChange("hour", displayHour.toString())}
                                        disabled={isTimeDisabled(displayHour, 0, timeAMPMFormat, true)}
                                    >
                                        {displayHour}
                                    </Button>
                                );
                            }
                        )}
                    </div>

                    {/* Minutes list */}
                    <div
                        ref={minutesRef}
                        className="w-16 h-[250px] overflow-y-auto overflow-x-hidden p-1.5 flex flex-col gap-1 overscroll-contain"
                        style={{ scrollbarWidth: "thin" }}
                    >
                        {Array.from({ length: 60 }, (_, i) => i).map((minute) => {
                            const currentHour = value ? value.getHours() : 0;
                            const displayHour = timeFormat === "12-hour"
                                ? (currentHour % 12 === 0 ? 12 : currentHour % 12)
                                : currentHour;
                            const isSelected = value && value.getMinutes() === minute;

                            return (
                                <Button
                                    key={minute}
                                    size="icon"
                                    data-selected={isSelected ? "true" : undefined}
                                    variant={isSelected ? "default" : "ghost"}
                                    className="w-full shrink-0 aspect-square text-sm font-medium"
                                    onClick={() => handleTimeChange("minute", minute.toString())}
                                    disabled={isTimeDisabled(displayHour, minute, timeAMPMFormat)}
                                >
                                    {minute.toString().padStart(2, "0")}
                                </Button>
                            );
                        })}
                    </div>

                    {/* AM/PM list (Only for 12-hour format) */}
                    {timeFormat === "12-hour" && (
                        <div
                            className="w-16 h-[250px] overflow-y-auto overflow-x-hidden p-1.5 flex flex-col gap-1 overscroll-contain"
                            style={{ scrollbarWidth: "thin" }}
                        >
                            {["AM", "PM"].map((ampm) => (
                                <Button
                                    key={ampm}
                                    size="icon"
                                    variant={timeAMPMFormat === ampm ? "default" : "ghost"}
                                    className="w-full shrink-0 aspect-square text-sm font-medium"
                                    onClick={() => handleTimeChange("ampm", ampm)}
                                >
                                    {ampm}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}