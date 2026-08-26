import { z } from "zod";

export const vehicleOptions = [
  "Force Traveller",
  "Force Urbania",
  "Not Sure",
] as const;

export const tripTypeOptions = [
  "Family Trip",
  "Corporate Travel",
  "Wedding Transportation",
  "Religious Journey",
  "Airport Transfer",
  "School or College Trip",
  "Other",
] as const;

export const enquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+\d][\d\s()-]{7,}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  travelDate: z.string().min(1, "Travel date is required"),
  returnDate: z.string().optional().or(z.literal("")),
  pickupLocation: z
    .string()
    .trim()
    .min(2, "Pickup location is required")
    .max(200),
  destination: z.string().trim().min(2, "Destination is required").max(200),
  passengers: z
    .string()
    .trim()
    .min(1, "Number of passengers is required")
    .refine((val) => {
      const n = Number(val);
      return Number.isInteger(n) && n >= 1 && n <= 60;
    }, "Enter a passenger count between 1 and 60"),
  preferredVehicle: z.enum(vehicleOptions, {
    required_error: "Please select a preferred vehicle",
  }),
  tripType: z.enum(tripTypeOptions, {
    required_error: "Please select a trip type",
  }),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please consent so we can contact you about this enquiry",
    }),
  }),
  // Honeypot — must stay empty
  website: z.string().max(0).optional().or(z.literal("")),
  sourcePage: z.string().optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(100),
  phone: z
    .string()
    .trim()
    .min(8, "Please enter a valid phone number")
    .max(20)
    .regex(/^[+\d][\d\s()-]{7,}$/, "Please enter a valid phone number"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  subject: z.string().trim().min(2, "Please enter a subject").max(150),
  message: z.string().trim().min(10, "Please enter a message").max(2000),
  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please consent so we can contact you about this enquiry",
    }),
  }),
  website: z.string().max(0).optional().or(z.literal("")),
  sourcePage: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
