import projectController from "@/controllers/projectController";
import { asyncHandler } from "@/helpers/asyncHandler";
import express from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { ProjectSchema } from "@/models/schema/projectSchema";
import authenticateToken from "@/middlewares/authenticationCookie";

const router = express.Router();
router.use(authenticateToken as express.RequestHandler);

export const projectRegistry = new OpenAPIRegistry()
projectRegistry.register('Project', ProjectSchema)

projectRegistry.registerPath({
    method: 'post',
    path:  '/api/v1/projects/new-project',
    tags: ['Project'],
    summary: 'Create new project',
    description: 'Create a new project for the authenticated user',
    security: [{ cookieAuth: [] }],
    responses: {}
})
router.post('/new-project', asyncHandler(projectController.createProjectController))

projectRegistry.registerPath({
    method: 'get',
    path:  '/api/v1/projects/projects-of-owner',
    tags: ['Project'],
    summary: 'Get all projects of owner',
    description: 'Retrieve a project by its ID',
    responses: {}
})
router.get('/projects-of-owner', asyncHandler(projectController.getAllProjectsOfOwnerController))

projectRegistry.registerPath({
    method: 'patch',
    path:  '/api/v1/projects/update-project/:projectId',
    tags: ['Project'],
    summary: 'Update project by ID',
    description: 'Update a project by its ID',
    security: [{ cookieAuth: [] }],
    responses: {}
})
router.patch('/update-project/:id', asyncHandler(projectController.updateProjectController))

projectRegistry.registerPath({
    method: 'delete',
    path:  '/api/v1/projects/delete-project/:projectId',
    tags: ['Project'],
    summary: 'Delete project by ID',
    description: 'Delete a project by its ID',
    security: [{ cookieAuth: [] }],
    responses: {}
})
router.delete('/delete-project/:id', asyncHandler(projectController.deleteProjectController))

export default router;
