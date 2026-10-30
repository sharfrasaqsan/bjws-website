"use client";

import * as React from "react";
import { useActionState } from "react";
import { Link } from "@/i18n/routing";
import { submitMembershipAction, type ActionResponse } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Badge } from "@/components/ui/badge";

interface MembershipFormProps {
  translations: {
    fullNameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    emailOptional: string;
    addressLabel: string;
    familySizeLabel: string;
    familySizeHint: string;
    planLabel: string;
    planMonthly: string;
    planMonthlyPrice: string;
    planAnnual: string;
    planAnnualPrice: string;
    preferredContactLabel: string;
    contactPhone: string;
    contactWhatsapp: string;
    contactSms: string;
    consentText: string;
    privacyLinkText: string;
    submitButton: string;
    submittingButton: string;
    successTitle: string;
    successMessage: string;
    errors: Record<string, string>;
  };
}

const initialState: ActionResponse = {
  success: false,
};

export function MembershipForm({ translations }: MembershipFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitMembershipAction,
    initialState
  );

  const getErrorText = (key?: string) => {
    if (!key) return undefined;
    return translations.errors[key] || key;
  };

  if (state.success) {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50/80 p-8 text-center text-emerald-950 shadow-xs">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-emerald-900">
          {translations.successTitle}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-emerald-800">
          {translations.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Honeypot Spam Field */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="organization_code">Leave blank</label>
        <input
          type="text"
          id="organization_code"
          name="organization_code"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Global Error Alert */}
      {state.messageKey && !state.success && (
        <div
          role="alert"
          className="border-destructive/40 text-destructive rounded-lg border bg-red-50 p-4 text-xs sm:text-sm"
        >
          {getErrorText(state.messageKey)}
        </div>
      )}

      {/* Full Name */}
      <FormField
        id="fullName"
        label={translations.fullNameLabel}
        required
        error={getErrorText(state.fieldErrors?.fullName)}
      >
        <Input
          name="fullName"
          placeholder="e.g. A.M. Mohamed"
          required
          disabled={isPending}
        />
      </FormField>

      {/* Primary Phone Number */}
      <FormField
        id="phone"
        label={translations.phoneLabel}
        required
        error={getErrorText(state.fieldErrors?.phone)}
      >
        <Input
          type="tel"
          name="phone"
          placeholder="07X-XXXXXXX"
          required
          disabled={isPending}
        />
      </FormField>

      {/* Email (Optional) */}
      <FormField
        id="email"
        label={`${translations.emailLabel} (${translations.emailOptional})`}
        error={getErrorText(state.fieldErrors?.email)}
      >
        <Input
          type="email"
          name="email"
          placeholder="user@example.com"
          disabled={isPending}
        />
      </FormField>

      {/* Address Area */}
      <FormField
        id="addressArea"
        label={translations.addressLabel}
        required
        error={getErrorText(state.fieldErrors?.addressArea)}
      >
        <Input
          name="addressArea"
          placeholder="e.g. Eacha Nagar / Kandy Road, Mullipothanai"
          required
          disabled={isPending}
        />
      </FormField>

      {/* Family Size (Optional) */}
      <FormField
        id="familySize"
        label={translations.familySizeLabel}
        hint={translations.familySizeHint}
        error={getErrorText(state.fieldErrors?.familySize)}
      >
        <Input
          type="number"
          name="familySize"
          min={1}
          max={20}
          placeholder="e.g. 5"
          disabled={isPending}
        />
      </FormField>

      {/* Preferred Plan (Monthly vs Annual) */}
      <div className="space-y-2">
        <label className="text-text block text-sm font-medium">
          {translations.planLabel} <span className="text-destructive">*</span>
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="border-border bg-surface hover:border-primary/50 has-[:checked]:border-primary flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-colors has-[:checked]:bg-[#e8f3ee]">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="plan"
                value="monthly"
                defaultChecked
                disabled={isPending}
                className="text-primary focus:ring-primary"
              />
              <span className="text-text text-sm font-medium">
                {translations.planMonthly}
              </span>
            </div>
            <Badge variant="primary" size="sm">
              {translations.planMonthlyPrice}
            </Badge>
          </label>

          <label className="border-border bg-surface hover:border-primary/50 has-[:checked]:border-primary flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition-colors has-[:checked]:bg-[#e8f3ee]">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="plan"
                value="annual"
                disabled={isPending}
                className="text-primary focus:ring-primary"
              />
              <span className="text-text text-sm font-medium">
                {translations.planAnnual}
              </span>
            </div>
            <Badge variant="primary" size="sm">
              {translations.planAnnualPrice}
            </Badge>
          </label>
        </div>
      </div>

      {/* Preferred Communication Method */}
      <div className="space-y-2">
        <label className="text-text block text-sm font-medium">
          {translations.preferredContactLabel}
        </label>
        <div className="text-text flex flex-wrap items-center gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="preferredContact"
              value="phone"
              defaultChecked
              disabled={isPending}
              className="text-primary focus:ring-primary"
            />
            <span>{translations.contactPhone}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="preferredContact"
              value="whatsapp"
              disabled={isPending}
              className="text-primary focus:ring-primary"
            />
            <span>{translations.contactWhatsapp}</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="preferredContact"
              value="sms"
              disabled={isPending}
              className="text-primary focus:ring-primary"
            />
            <span>{translations.contactSms}</span>
          </label>
        </div>
      </div>

      {/* Mandatory Consent Checkbox Linking to Privacy Policy */}
      <div className="space-y-1 pt-1">
        <div className="flex items-start gap-3">
          <input
            id="membership-consent"
            name="consent"
            type="checkbox"
            required
            disabled={isPending}
            className="border-border text-primary focus:ring-primary mt-1 h-4 w-4 cursor-pointer rounded"
          />
          <label
            htmlFor="membership-consent"
            className="text-text-muted cursor-pointer text-xs leading-relaxed select-none sm:text-sm"
          >
            {translations.consentText}{" "}
            <Link
              href="/privacy"
              target="_blank"
              className="text-primary hover:text-primary-hover font-medium underline underline-offset-2"
            >
              {translations.privacyLinkText}
            </Link>
            . <span className="text-destructive">*</span>
          </label>
        </div>
        {state.fieldErrors?.consent && (
          <p role="alert" className="text-destructive pl-7 text-xs font-medium">
            {getErrorText(state.fieldErrors.consent)}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        isLoading={isPending}
        className="w-full"
      >
        {isPending ? translations.submittingButton : translations.submitButton}
      </Button>
    </form>
  );
}
