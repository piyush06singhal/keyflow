import { z } from "zod";

// Email validation
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .toLowerCase();

// Password validation with strength requirements
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Username validation
export const usernameSchema = z
  .string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Username can only contain letters, numbers, hyphens, and underscores",
  );

// Display name validation
export const displayNameSchema = z
  .string()
  .trim()
  .min(1, "Display name is required")
  .max(50, "Display name must be at most 50 characters");

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Register schema
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// Onboarding schema
export const onboardingSchema = z.object({
  displayName: displayNameSchema,
  username: usernameSchema.optional(),
  country: z.string().optional(),
  preferredLanguage: z.string().optional().default("en"),
  typingExperience: z
    .enum(["beginner", "intermediate", "advanced"])
    .optional()
    .default("beginner"),
  programmingExperience: z
    .enum(["none", "beginner", "intermediate", "advanced"])
    .optional()
    .default("none"),
  dailyGoal: z.number().min(5).max(240).optional().default(30),
  preferredTheme: z.enum(["light", "dark", "system"]).optional().default("system"),
  keyboardLayout: z.string().optional().default("qwerty"),
  aiEnabled: z.boolean().optional().default(false),
});

export type OnboardingInput = z.input<typeof onboardingSchema>;
