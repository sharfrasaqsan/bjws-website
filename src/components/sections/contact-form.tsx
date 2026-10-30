"use client";

import * as React from "react";
import { useActionState } from "react";
import { Link } from "@/i18n/routing";
import { submitContactAction, type ActionResponse } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";

interface ContactFormProps {
  locale: string;
  translations: {
    title: string;
    description: string;
    nameLabel: string;
    phoneLabel: string;
    emailLabel: string;
    emailOptional: string;
    messageLabel: string;
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

export function ContactForm({ locale, translations }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitContactAction,
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
    <form action={formAction} className="space-y-5">
      {/* Hidden locale and Honeypot Spam Trap */}
      <input type="hidden" name="locale" value={locale} />
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="website_url">Leave this field blank</label>
        <input
          type="text"
          id="website_url"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Global Error Banner */}
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
        id="name"
        label={translations.nameLabel}
        required
        error={getErrorText(state.fieldErrors?.name)}
      >
        <Input
          name="name"
          placeholder="e.g. M. Mohamed"
          required
          disabled={isPending}
        />
      </FormField>

      {/* Contact Phone Number */}
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
          placeholder="name@example.com"
          disabled={isPending}
        />
      </FormField>

      {/* Message Text */}
      <FormField
        id="message"
        label={translations.messageLabel}
        required
        error={getErrorText(state.fieldErrors?.message)}
      >
        <Textarea
          name="message"
          rows={4}
          placeholder="Please describe your inquiry or request..."
          required
          disabled={isPending}
        />
      </FormField>

      {/* Mandatory Consent Checkbox Linking to Privacy Policy */}
      <div className="space-y-1 pt-1">
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            disabled={isPending}
            className="border-border text-primary focus:ring-primary mt-1 h-4 w-4 cursor-pointer rounded"
          />
          <label
            htmlFor="consent"
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
