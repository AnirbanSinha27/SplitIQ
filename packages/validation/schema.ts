import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Group name is required'),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
});
