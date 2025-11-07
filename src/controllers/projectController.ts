import ProjectService from "@/services/projectService";
import { SuccessResponse } from "@/core/success.response"
import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authenticationCookie";
import Project from "@/models/entities/projects.entity";
import { BadRequestError } from "@/core/error.response";
import { get } from "lodash";

class projectController {
    createProjectController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        // owner lấy từ cookie
        const ownerId = req.user?.userId;
        if (!ownerId) {
            return next(new Error('User ID not found in cookies'));
        }
        const projectData = new Project()
        projectData.name = req.body.name
        projectData.description = req.body.description
        projectData.owner = { id: ownerId } as any // Gán owner từ cookie
        const data = await ProjectService.createProjectService(projectData)
        return new SuccessResponse({
            message: 'Tạo project thành công',
            metadata: data
        }).send(res)
    }

    getAllProjectsOfOwnerController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const ownerId = req.user?.userId as string;
        if (!ownerId) {
            return next(new Error('User ID not found in cookies'));
        }
        const data = await ProjectService.getAllProjectsOfOwnerService(ownerId)
        return new SuccessResponse({
            message: 'Lấy danh sách project thành công',
            metadata: data
        }).send(res)
    }

    updateProjectController = async (req: Request, res: Response, next: NextFunction) => {
        const projectId = req.params.id
        const projectData = req.body
        const data = await ProjectService.updateProjectService(projectId, projectData)
        return new SuccessResponse({
            message: 'Cập nhật project thành công',
            metadata: data
        }).send(res)
    }

    deleteProjectController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { id: projectId } = req.params; 
        const userId = req.user?.userId as string;

        if (!userId) {
            throw new BadRequestError('User không hợp lệ. Vui lòng đăng nhập lại.');
        }

        const data = await ProjectService.deleteProjectService(projectId, userId);
        
        return new SuccessResponse({
            message: 'Xóa project thành công',
            metadata: data
        }).send(res);
    }

    getAllProjectsOfMemberController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const userId = req.user?.userId as string;
        if (!userId) {
            return next(new Error('User ID not found in cookies'));
        }
        const data = await ProjectService.getAllProjectsOfMemberService(userId)
        return new SuccessResponse({
            message: 'Lấy danh sách project thành công',
            metadata: data
        }).send(res);
    }
}

export default new projectController()