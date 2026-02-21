import { z } from "zod";

// Contact Information Schema
export const contactInfoSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.email("Invalid email format"),
    confirmEmail: z.string().min(1, "Email confirmation is required"),
    phone: z.string().min(1, "Phone number is required"),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails do not match",
    path: ["confirmEmail"],
  });

// Attendee Information Schema
export const attendeeInfoSchema = z.object({
  ticketId: z.string(),
  ticketName: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

// Attendees Array Schema
export const attendeesSchema = z
  .array(attendeeInfoSchema)
  .min(1, "At least one attendee is required");

// Full Checkout Form Schema
export const checkoutFormSchema = z.object({
  contact: contactInfoSchema,
  attendees: attendeesSchema,
});

// Type exports
export type ContactInfoInput = z.input<typeof contactInfoSchema>;
export type ContactInfoOutput = z.output<typeof contactInfoSchema>;
export type AttendeeInfoInput = z.input<typeof attendeeInfoSchema>;
export type AttendeeInfoOutput = z.output<typeof attendeeInfoSchema>;
export type CheckoutFormInput = z.input<typeof checkoutFormSchema>;
export type CheckoutFormOutput = z.output<typeof checkoutFormSchema>;

// Helper function to format Zod errors into the expected error structure
export function formatContactErrors(
  errors: z.ZodError,
): Partial<Record<keyof z.infer<typeof contactInfoSchema>, string>> {
  const formatted: Partial<
    Record<keyof z.infer<typeof contactInfoSchema>, string>
  > = {};

  for (const error of errors.issues) {
    const path = error.path[0] as keyof z.infer<typeof contactInfoSchema>;
    if (path) {
      formatted[path] = error.message;
    }
  }

  return formatted;
}

// Helper function to format attendee errors
export function formatAttendeeErrors(
  errors: z.ZodError,
): Partial<Record<keyof z.infer<typeof attendeeInfoSchema>, string>> {
  const formatted: Partial<
    Record<keyof z.infer<typeof attendeeInfoSchema>, string>
  > = {};

  for (const error of errors.issues) {
    const path = error.path[0] as keyof z.infer<typeof attendeeInfoSchema>;
    if (path) formatted[path] = error.message;
  }

  return formatted;
}
