import z from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const ProjectSchema = z.object({
    id: z.string().uuid(),
    name: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    isDeleted: z.boolean(),
    owner: z.object({
        id: z.string().uuid(),
        name: z.string().nullable().optional(),
        email: z.string().email()
    }),
    createdAt: z.date(),
    updatedAt: z.date()
})

export type Profile = z.infer<typeof ProjectSchema>;