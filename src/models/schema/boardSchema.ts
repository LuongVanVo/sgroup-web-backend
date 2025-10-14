import z from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const BoardSchema = z.object({
    id: z.string().uuid(),
    name: z.string().nullable().optional(),
    project: z.object({ id: z.string().uuid() }),
    background: z.string().nullable().optional(),
    position: z.number(),
    isDeleted: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date()
})

export type Board = z.infer<typeof BoardSchema>;