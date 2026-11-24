"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Send, CheckCircle2, MessageCircle } from "lucide-react";
import ReuseableForm from "@/components/ui/CustomUi/ReuseForm/ReuseableForm";
import {
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox,
} from "@/components/ui/CustomUi/ReuseForm/Form";
import { SelectItem } from "@/components/ui/select";
import ReusableGradientButton from "@/components/ui/CustomUi/ReusableGradientButton";
import { submitPublicLead } from "@/service/HomeService/HomeServiceApi";
import { createConversation, sendMessage } from "@/service/ChatService/ChatServiceApi";
import { errorMessage } from "@/lib/apiRequest";
import { useSessionUser } from "@/lib/useSessionUser";
import ConversationModal from "@/components/support/ConversationModal";

interface ContactFormValues {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  consent: boolean;
}

export const SendMessageForm: React.FC = () => {
  const me = useSessionUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const form = useForm<ContactFormValues>({
    defaultValues: { name: me?.name || "", email: me?.email || "", phone: me?.phone || "", subject: "General Inquiry", message: "", consent: false },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    if (me) {
      const convRes = await createConversation({ kind: "CUSTOMER_SUPPORT" });
      if (!convRes.success) {
        setSubmitError(errorMessage(convRes));
        setIsSubmitting(false);
        return;
      }
      const msgRes = await sendMessage(convRes.data._id, `${values.subject}: ${values.message}`);
      setIsSubmitting(false);
      if (msgRes.success) {
        setIsSent(true);
        form.reset();
      } else {
        setSubmitError(errorMessage(msgRes));
      }
      return;
    }

    const res = await submitPublicLead({
      name: values.name,
      email: values.email,
      phone: values.phone,
      kind: "CONTACT",
      message: `${values.subject}: ${values.message}`,
    });
    setIsSubmitting(false);
    if (res.success) {
      setIsSent(true);
      form.reset();
    } else {
      setSubmitError(errorMessage(res));
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-2xs">
      <div className="flex flex-col gap-1.5 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          Send us a message
        </h2>
        <p className="text-sm text-zinc-500 font-medium">
          Have a question about your maintenance, billing, or equipment? Fill out the form below and our Madrid dispatch team will reply within 2 hours.
        </p>
      </div>

      {isSent ? (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex flex-col items-center justify-center gap-3 text-center my-4">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          <h3 className="font-bold text-lg text-emerald-900">Message sent successfully!</h3>
          <p className="text-sm text-emerald-700 max-w-md">
            Thank you for reaching out. A Pure Pool technician or support specialist has received your message and will get back to you shortly.
          </p>
          {me && (
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> Continue in chat
            </button>
          )}
        </div>
      ) : (
        <ReuseableForm<ContactFormValues>
          form={form}
          onSubmit={onSubmit}
          className="flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="name"
              label="Full Name"
              placeholder="e.g. Carlos Rodriguez"
              inputClassName="h-12 bg-zinc-50 border-zinc-200 focus:border-sky-500 rounded-xl text-zinc-900 placeholder:text-zinc-400"
            />
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="carlos@example.com"
              inputClassName="h-12 bg-zinc-50 border-zinc-200 focus:border-sky-500 rounded-xl text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              control={form.control}
              name="phone"
              label="Phone Number (Optional)"
              type="tel"
              placeholder="+34 600 000 000"
              inputClassName="h-12 bg-zinc-50 border-zinc-200 focus:border-sky-500 rounded-xl text-zinc-900 placeholder:text-zinc-400"
            />
            <FormSelect
              control={form.control}
              name="subject"
              label="Inquiry Topic"
              placeholder="Select topic..."
              triggerClassName="h-12 bg-zinc-50 border-zinc-200 focus:border-sky-500 rounded-xl text-zinc-900"
            >
              <SelectItem value="General Inquiry">General Inquiry</SelectItem>
              <SelectItem value="Service & Maintenance">Service & Routine Maintenance</SelectItem>
              <SelectItem value="Equipment Issue">Equipment Breakdown / Repair</SelectItem>
              <SelectItem value="Billing & Invoices">Billing & Invoices</SelectItem>
              <SelectItem value="Water Chemistry">Water Testing / Chemical Balance</SelectItem>
              <SelectItem value="New Pool Upgrade">Pool Upgrade / Heat Pump / Salt System</SelectItem>
            </FormSelect>
          </div>

          <FormTextarea
            control={form.control}
            name="message"
            label="How can we help?"
            placeholder="Please describe your question, pool symptom, or service request in detail..."
            rows={4}
            inputClassName="bg-zinc-50 border-zinc-200 focus:border-sky-500 rounded-xl text-zinc-900 placeholder:text-zinc-400 min-h-[120px]"
          />

          {!me && (
            <div className="pt-1">
              <FormCheckbox
                control={form.control}
                name="consent"
                label="I agree to the privacy policy and consent to Pure Pool contacting me regarding this inquiry."
              />
            </div>
          )}

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <div className="pt-2 flex justify-end">
            <ReusableGradientButton
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 h-12 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Sending message..." : "Send message"}</span>
            </ReusableGradientButton>
          </div>
        </ReuseableForm>
      )}

      {me && (
        <ConversationModal
          open={chatOpen}
          onOpenChange={setChatOpen}
          kind="CUSTOMER_SUPPORT"
          title="Pure Pool Support"
          subtitle="Our office team usually replies within 2 hours"
        />
      )}
    </div>
  );
};

export default SendMessageForm;
