// Shared between the newsletter Server Actions and their client forms.

export type SignupState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "error"; message: string; email?: string };

export type ConfirmState =
  | { status: "idle" }
  | { status: "confirmed" }
  | { status: "error"; message: string };

// Name of the hidden honeypot field. Real visitors never see or fill it.
export const HONEYPOT_FIELD = "website";

// Minimum time between the form appearing and being submitted.
export const MIN_FILL_TIME_MS = 1500;
