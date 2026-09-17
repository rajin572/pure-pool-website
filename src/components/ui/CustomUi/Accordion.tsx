"use client";

import { useEffect, useRef, useState } from "react";
import { GoPlus } from "react-icons/go";
import { HiMinus } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { ChevronDown } from "lucide-react";
import { cn } from "../../../lib/utils";

// Define types for the props
export interface AccordionProps {
  isEditing?: boolean;
  num?: string | number;
  item: {
    question: string;
    answer: string;
  };
  className?: string;
  questionClassName?: string;
  answerClassName?: string;
  variant?: "admin" | "bordered" | "card";
  defaultOpen?: boolean;
  showFaqUpdateModal?: (item: { question: string; answer: string }) => void;
  showFaqDeleteModal?: (item: { question: string; answer: string }) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  isEditing = false,
  num,
  item,
  className,
  questionClassName,
  answerClassName,
  variant = "bordered",
  defaultOpen = false,
  showFaqUpdateModal,
  showFaqDeleteModal,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  if (variant === "admin") {
    return (
      <div
        onClick={() => {
          if (!isEditing) toggleAccordion();
        }}
        className={cn(
          "mb-5 bg-[#F2EBFD] duration-500 rounded shadow",
          className
        )}
      >
        {num && (
          <h1 className="px-4 pt-4 pb-2 text-base-color/50 text-xl md:text-2xl lg:text-3xl font-semibold">
            {num}
          </h1>
        )}
        <div className="flex justify-between items-center px-4 pb-4 cursor-pointer duration-500">
          <h3 className={cn("text-base-color text-base md:text-lg lg:text-xl font-semibold", questionClassName)}>
            {item?.question}
          </h3>
          <div className="flex gap-2">
            {isEditing && (
              <>
                {showFaqUpdateModal && (
                  <div onClick={() => showFaqUpdateModal(item)} className="p-[2px]">
                    <FaEdit className="text-base-color text-base md:text-lg lg:text-xl duration-500" />
                  </div>
                )}
                {showFaqDeleteModal && (
                  <div onClick={() => showFaqDeleteModal(item)} className="p-[2px]">
                    <MdDelete className="text-base-color text-base md:text-lg lg:text-xl duration-500" />
                  </div>
                )}
              </>
            )}
            {isOpen ? (
              <div
                onClick={() => {
                  if (isEditing) toggleAccordion();
                }}
                className="p-[2px] rounded-full border border-[#000000] bg-[#000000]"
              >
                <HiMinus className="text-[#F2EBFD] text-base md:text-lg lg:text-xl duration-500" />
              </div>
            ) : (
              <div
                onClick={() => {
                  if (isEditing) toggleAccordion();
                }}
                className="p-[2px] rounded-full border border-[#000000] bg-[#000000]"
              >
                <GoPlus className="text-[#F2EBFD] text-base md:text-lg lg:text-xl duration-500" />
              </div>
            )}
          </div>
        </div>
        <div
          ref={contentRef}
          style={{
            height: `${height}px`,
            overflow: "hidden",
            transition: "height 0.35s ease",
          }}
        >
          <div className={cn("p-4 bg-[#F2EBFD] text-base-color duration-500 text-sm md:text-base lg:text-lg rounded-bl rounded-br", answerClassName)}>
            {item?.answer}
          </div>
        </div>
      </div>
    );
  }

  // Modern clean bordered accordion matching Figma design
  return (
    <div
      className={cn(
        "border-t border-gray-200 transition-colors duration-300",
        className
      )}
    >
      <button
        type="button"
        onClick={toggleAccordion}
        className="w-full py-5 flex items-center justify-between gap-4 text-left cursor-pointer group select-none focus:outline-none"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "text-base sm:text-lg lg:text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors duration-200",
            questionClassName
          )}
        >
          {item?.question}
        </span>
        <span
          className={cn(
            "shrink-0 text-gray-500 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-sky-600",
            isOpen && "rotate-180"
          )}
        >
          <ChevronDown className="size-5" />
        </span>
      </button>
      <div
        ref={contentRef}
        style={{
          height: `${height}px`,
          overflow: "hidden",
          transition: "height 0.5s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <div
          className={cn(
            "pb-6 text-sm sm:text-base text-gray-600 font-normal leading-relaxed",
            answerClassName
          )}
        >
          {item?.answer}
        </div>
      </div>
    </div>
  );
};

export default Accordion;
