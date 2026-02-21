"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@atrangi/ui";
import { Mail, Phone } from "lucide-react";
import type {
  UseFormRegister,
  FieldErrors,
  FieldValues,
} from "react-hook-form";
import type { CheckoutFormInput } from "@/lib/validation/checkout";

interface ContactFormProps {
  register: UseFormRegister<CheckoutFormInput>;
  errors?: FieldErrors<CheckoutFormInput["contact"]>;
  touchedFields?: Partial<Readonly<FieldValues>>;
  isSubmitted: boolean;
}

export function ContactForm({
  register,
  errors,
  touchedFields,
  isSubmitted,
}: Readonly<ContactFormProps>) {
  const shouldShowError = (field: keyof CheckoutFormInput["contact"]) => {
    return isSubmitted || touchedFields?.[field];
  };
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Mail className="w-5 h-5" />
          Contact Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          We&apos;ll send tickets and updates to this email
        </p>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 overflow-auto">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">
              First Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="firstName"
              {...register("contact.firstName")}
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
            <Label htmlFor="lastName">
              Last Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lastName"
              {...register("contact.lastName")}
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

        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            {...register("contact.email")}
            placeholder="john.doe@example.com"
            className={
              errors?.email && shouldShowError("email")
                ? "border-destructive"
                : ""
            }
          />
          {errors?.email && shouldShowError("email") && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmEmail">
            Confirm Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="confirmEmail"
            type="email"
            {...register("contact.confirmEmail")}
            placeholder="john.doe@example.com"
            className={
              errors?.confirmEmail && shouldShowError("confirmEmail")
                ? "border-destructive"
                : ""
            }
          />
          {errors?.confirmEmail && shouldShowError("confirmEmail") && (
            <p className="text-sm text-destructive">
              {errors.confirmEmail.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <Input
              id="phone"
              type="tel"
              {...register("contact.phone")}
              placeholder="(555) 123-4567"
              className={
                errors?.phone && shouldShowError("phone")
                  ? "border-destructive"
                  : ""
              }
            />
            <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          {errors?.phone && shouldShowError("phone") && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            For important event updates and ticket verification
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
