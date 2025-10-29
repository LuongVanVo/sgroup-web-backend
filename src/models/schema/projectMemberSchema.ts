import z from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const ProjectMemberSchema = z.object({
    projectId: z.string().uuid(),
    userId: z.string().uuid(),
    status: z.enum(['pending', 'accepted', 'rejected']),
    invitationToken: z.string().nullable().optional(),
    joinedAt: z.date()
})