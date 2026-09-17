"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import {
  FormInput,
  FormSelect,
  FormDatePicker,
  FormTimePicker,
  FormTextarea,
  SelectItem,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";

// =========================================================================
// API INTEGRATION READY PLACEHOLDERS (Redux Toolkit Query / Server Actions)
// =========================================================================
// import {
//   useCreateQuoteRequestMutation, // POST
//   useGetMaintenancePlansQuery,   // GET
//   useUpdateQuoteRequestMutation, // PATCH
//   useDeleteQuoteRequestMutation, // DELETE
// } from "@/redux/features/quote/quoteApi";

export interface QuoteFormValues {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  selectedPlan: string;
  poolSize?: string;
  preferredDate?: Date;
  preferredTime?: Date;
  notes?: string;
}

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = "Premium",
}) => {
  // =======================================================================
  // Redux API Hooks (Uncomment when connecting to backend endpoints)
  // =======================================================================
  // const [createQuoteRequest, { isLoading: isSubmitting }] = useCreateQuoteRequestMutation();
  // const { data: plansList, isLoading: isPlansLoading } = useGetMaintenancePlansQuery();
  // const [updateQuoteRequest] = useUpdateQuoteRequestMutation();
  // const [deleteQuoteRequest] = useDeleteQuoteRequestMutation();

  const form = useForm<QuoteFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      selectedPlan: defaultPlan,
      poolSize: "medium",
      notes: "",
    },
  });

  useEffect(() => {
    if (defaultPlan) {
      form.setValue("selectedPlan", defaultPlan);
    }
  }, [defaultPlan, form]);

  const onSubmit = async (_values: QuoteFormValues) => {
    // =====================================================================
    // POST request example:
    // try {
    //   const response = await createQuoteRequest(values).unwrap();
    //   toast.success("Quote request submitted successfully!");
    //   form.reset();
    //   onClose();
    // } catch (err: any) {
    //   toast.error(err?.data?.message || "Failed to submit quote request.");
    // }
    // =====================================================================

    // Design phase mock confirmation
    toast.success("Thank you! Your quote request has been received. Our team will contact you within 24 hours.");
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white">
        <DialogHeader className="mb-4 text-left">
          <div className="text-xs font-mono font-extrabold uppercase text-sky-600 tracking-wider">
            FREE ESTIMATE
          </div>
          <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Request a Free Pool Quote
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-gray-600">
            Tell us a few details about your pool in Madrid and we’ll send you a fixed, transparent monthly plan.
          </DialogDescription>
        </DialogHeader>

        <ReuseableForm form={form} onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="fullName"
              label="Full Name"
              placeholder="e.g. Juan Pérez"
            />
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="e.g. juan@example.com"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="+34 600 000 000"
            />
            <FormInput
              control={form.control}
              name="location"
              label="Pool Address / Area (Madrid)"
              placeholder="e.g. Calle de Alcalá, Madrid"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              control={form.control}
              name="selectedPlan"
              label="Maintenance Plan"
              placeholder="Select a plan"
            >
              <SelectItem value="Essential">Essential (€60/mo - Fortnightly)</SelectItem>
              <SelectItem value="Premium">Premium (€85/mo - Weekly)</SelectItem>
              <SelectItem value="Commercial">Commercial (€340/mo - Public/Hotel)</SelectItem>
              <SelectItem value="Repairs">Repairs & Diagnostics</SelectItem>
              <SelectItem value="Installation">Equipment Installation</SelectItem>
            </FormSelect>

            <FormSelect
              control={form.control}
              name="poolSize"
              label="Pool Approximate Size"
              placeholder="Choose size"
            >
              <SelectItem value="small">Small Residential (&lt; 30 m³)</SelectItem>
              <SelectItem value="medium">Medium Residential (30 - 60 m³)</SelectItem>
              <SelectItem value="large">Large Residential (&gt; 60 m³)</SelectItem>
              <SelectItem value="community">Community / Shared Pool</SelectItem>
              <SelectItem value="olympic">Commercial / Hotel Facility</SelectItem>
            </FormSelect>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormDatePicker
              control={form.control}
              name="preferredDate"
              label="Preferred Inspection Date"
              placeholder="Choose a date"
              disablePast
            />
            <FormTimePicker
              control={form.control}
              name="preferredTime"
              label="Preferred Time Window"
              placeholder="Select time"
              timeFormat="12-hour"
            />
          </div>

          <FormTextarea
            control={form.control}
            name="notes"
            label="Additional Notes / Current Pool Issues"
            placeholder="Tell us about existing equipment, water condition, or special access instructions..."
            rows={3}
          />

          <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <ReusableGradientButton
              type="submit"
              size="lg"
              className="px-6 py-2.5"
            >
              Submit Quote Request
            </ReusableGradientButton>
          </div>
        </ReuseableForm>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteRequestModal;
