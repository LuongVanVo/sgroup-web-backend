import z from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().nullable().optional(),
    password: z.string(),
    email: z.string().email(),
    avatar_url: z.string().nullable().optional(),
    isActive: z.boolean(),
    isDeleted: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date()
});

export type User = z.infer<typeof UserSchema>;