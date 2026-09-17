import { ReactNode } from "react";
import {
  FieldValues,
  UseFormReturn,
  FormProvider,
  SubmitHandler,
} from "react-hook-form";

export interface ReuseableFormProps<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues>;
  onSubmit?: SubmitHandler<TFieldValues>;
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function ReuseableForm<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  id,
}: ReuseableFormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        id={id}
        onSubmit={onSubmit ? form.handleSubmit(onSubmit) : (e) => e.preventDefault()}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
}

