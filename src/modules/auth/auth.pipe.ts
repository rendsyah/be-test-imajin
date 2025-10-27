import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email().max(150).toLowerCase(),
  password: z.string().min(1).max(32),
  name: z.string().min(1).max(100),
  phone: z
    .string()
    .min(1)
    .max(25)
    .regex(/^(62|08)[0-9]{7,20}$/, 'Invalid phone number'),
});

export const LoginSchema = z.object({
  user: z.string().min(1),
  password: z.string().min(1),
  device: z.object({
    firebase_id: z.string(),
    device_browser: z.string(),
    device_browser_version: z.string(),
    device_imei: z.string(),
    device_model: z.string(),
    device_type: z.string(),
    device_vendor: z.string(),
    device_os: z.string(),
    device_os_version: z.string(),
    device_platform: z.enum(['Web', 'Mobile']),
    user_agent: z.string(),
    app_version: z.string().min(1),
  }),
});
