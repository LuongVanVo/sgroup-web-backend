import projectMemberController from "@/controllers/projectMemberController";
import express from "express";
import { asyncHandler } from "@/helpers/asyncHandler";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { ProjectMemberSchema } from "@/models/schema/projectMemberSchema";
import authenticateToken from "@/middlewares/authenticationCookie";
import { loadProjectRole, checkRole, checkPermission } from "@/middlewares/rbac";
import { AuthenticatedRequest } from "@/middlewares/authenticationCookie";

const router = express.Router()
// router.use(authenticateToken as express.RequestHandler)
export const projectMemberRegistry = new OpenAPIRegistry()
projectMemberRegistry.register('ProjectMember', ProjectMemberSchema)

projectMemberRegistry.registerPath({
    method: 'post',
    path: '/api/v1/project-members/invite-member/:projectId',
    tags: ['Project Member'],
    summary: 'Invite member to project',
    description: 'Invite a member to join a project by their email',
    responses: {}
})
router.post(
  '/invite-member/:projectId',
  authenticateToken as unknown as express.RequestHandler,
  loadProjectRole((req: AuthenticatedRequest) => req.params.projectId as string) as unknown as express.RequestHandler,
  checkRole(['owner']) as unknown as express.RequestHandler,
  asyncHandler(projectMemberController.inviteMemberToProjectController)
)

// Accept invitation
projectMemberRegistry.registerPath({
    method: 'post',
    path: '/api/v1/project-members/accept-invitation',
    tags: ['Project Member'],
    summary: 'Accept project invitation',
    description: 'Accept an invitation to join a project',
    responses: {}
})
router.post('/accept-invitation', asyncHandler(projectMemberController.acceptInvitationController))

// Reject invitation
projectMemberRegistry.registerPath({
    method: 'post',
    path: '/api/v1/project-members/reject-invitation',
    tags: ['Project Member'],
    summary: 'Reject project invitation',
    description: 'Reject an invitation to join a project',
    responses: {}
})
router.post('/reject-invitation', asyncHandler(projectMemberController.rejectInvitationController))

// Get all members in a project
projectMemberRegistry.registerPath({
    method: 'get',
    path: '/api/v1/project-members/:projectId',
    tags: ['Project Member'],
    summary: 'Get all members in a project',
    description: 'Retrieve a list of all members in a specific project',
    responses: {}
})
router.get(
  '/:projectId',
  authenticateToken as unknown as express.RequestHandler,
  loadProjectRole((req: AuthenticatedRequest) => req.params.projectId as string) as unknown as express.RequestHandler,
  checkRole(['owner', 'member']) as unknown as express.RequestHandler,
  asyncHandler(projectMemberController.getAllMembersInProjectController)
)

// Remove member from project
projectMemberRegistry.registerPath({
    method: 'delete',
    path: '/api/v1/project-members/remove-member',
    tags: ['Project Member'],
    summary: 'Remove member from project',
    description: 'Remove a member from a project',
    responses: {}
})
router.delete(
  '/remove-member',
  authenticateToken as unknown as express.RequestHandler,
  loadProjectRole((req: AuthenticatedRequest) => req.body.projectId as string) as unknown as express.RequestHandler,
  checkRole(['owner']) as unknown as express.RequestHandler,
  asyncHandler(projectMemberController.removeMemberFromProjectController)
)

export default router