"use client";

import { QuickEnquiryForm } from "@/components/forms/QuickEnquiryForm";
import type { vehicleOptions } from "@/lib/validation";
import { cn } from "@/lib/utils";

type ContactEnquiryFormProps = {
  defaultDestination?: string;
  defaultVehicle?: (typeof vehicleOptions)[number];
  className?: string;
};

export function ContactEnquiryForm({
  defaultDestination,
  defaultVehicle,
  className,
}: ContactEnquiryFormProps) {
  return (
    <QuickEnquiryForm
      sourcePage="/contact"
      defaultDestination={defaultDestination}
      defaultVehicle={defaultVehicle}
      className={cn(className)}
    />
  );
}
