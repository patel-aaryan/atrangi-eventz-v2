"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Badge } from "@atrangi/ui";
import { User } from "lucide-react";
import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
} from "react-hook-form";
import type { CheckoutFormInput } from "@/lib/validation/checkout";

interface AttendeeCardProps {
  index: number;
  ticketId: string;
  ticketName: string;
  register: UseFormRegister<CheckoutFormInput>;
  errors?: FieldErrors<CheckoutFormInput["attendees"][number]>;
  touchedFields?: Partial<Readonly<FieldValues>>;
  isSubmitted: boolean;
}

export function AttendeeCard({
  index,
  ticketId,
  ticketName,
  register,
  errors,
  touchedFields,
  isSubmitted,
}: Readonly<AttendeeCardProps>) {
  const shouldShowError = (
    field: keyof CheckoutFormInput["attendees"][number]
  ) => {
    return isSubmitted || touchedFields?.[field];
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5" />
              Attendee {index + 1}
            </CardTitle>
            <Badge variant="outline">{ticketName}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`firstName-${ticketId}`}>
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`firstName-${ticketId}`}
                {...register(`attendees.${index}.firstName`)}
                placeholder="John"
                className={
                  errors?.firstName && shouldShowError("firstName")
                    ? "border-destructive"
                    : ""
                }
              />
              {errors?.firstName && shouldShowError("firstName") && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`lastName-${ticketId}`}>
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`lastName-${ticketId}`}
                {...register(`attendees.${index}.lastName`)}
                placeholder="Doe"
                className={
                  errors?.lastName && shouldShowError("lastName")
                    ? "border-destructive"
                    : ""
                }
              />
              {errors?.lastName && shouldShowError("lastName") && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
