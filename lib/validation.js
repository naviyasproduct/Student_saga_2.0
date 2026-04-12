import { z } from "zod";

export const signupSchema = z.object({
  username: z.string().trim().min(2).max(32),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
});

export const signinSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
});

export const topupSchema = z.object({
  amount: z
    .number()
    .int()
    .min(100, "Minimum top up is 100")
    .max(100000, "Maximum top up is 100000"),
});
