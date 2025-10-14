import boardController from "@/controllers/boardController";
import { asyncHandler } from "@/helpers/asyncHandler";
import express from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { BoardSchema } from "@/models/schema/boardSchema";
import authenticateToken from "@/middlewares/authenticationCookie";

const router = express.Router()
router.use(authenticateToken as express.RequestHandler);

export const boardRegistry = new OpenAPIRegistry()
boardRegistry.register('Board', BoardSchema)

boardRegistry.registerPath({
    method: 'post',
    path: '/api/v1/boards/new-board/:projectId',
    tags: ['Board'],
    summary: 'Create new board',
    description: 'Create a new board for a specific project',
    security: [{ cookieAuth: [] }],
    responses: {}
})
router.post('/new-board/:projectId', asyncHandler(boardController.createBoardController))

boardRegistry.registerPath({
    method: 'get',
    path: '/api/v1/boards/:projectId',
    tags: ['Board'],
    summary: 'Get all boards of a project',
    description: 'Retrieve all boards associated with a specific project',
    responses: {}
})
router.get('/:projectId', asyncHandler(boardController.getAllBoardsOfProjectController))

boardRegistry.registerPath({
    method: 'get',
    path: '/api/v1/boards/details/:boardId',
    tags: ['Board'],
    summary: 'Get board details',
    description: 'Retrieve details of a specific board',
    responses: {}
})
router.get('/details/:boardId', asyncHandler(boardController.getBoardDetailsController))

boardRegistry.registerPath({
    method: 'patch',
    path: '/api/v1/boards/update/:boardId',
    tags: ['Board'],
    summary: 'Update board by ID',
    description: 'Update a board by its ID',
    responses: {}
})
router.patch('/update/:boardId', asyncHandler(boardController.updateBoardController))

boardRegistry.registerPath({
    method: 'delete',
    path: '/api/v1/boards/delete/:boardId',
    tags: ['Board'],
    summary: 'Delete board by ID',
    description: 'Delete a board by its ID',
    responses: {}
})
router.delete('/delete/:boardId', asyncHandler(boardController.deleteBoardController))

export default router;