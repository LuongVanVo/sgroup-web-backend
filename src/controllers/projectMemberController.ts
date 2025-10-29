import { SuccessResponse } from "@/core/success.response";
import ProjectMemberService from "@/services/projectMemberService";
import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/middlewares/authenticationCookie";

class ProjectMemberController {
    inviteMemberToProjectController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId;
        const userId = req.body.userId as string;
        const data = await ProjectMemberService.inviteMemberInProject(userId, projectId);
        return new SuccessResponse({
            message: 'Mời thành viên vào project thành công',
            metadata: data
        }).send(res);
    }

    acceptInvitationController = async (req: Request, res: Response, next: NextFunction) => {
        // token lấy từ header Authorization
        const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header Authorization
        if (!token) {
            return next(new Error('Token không tồn tại trong header Authorization'));
        }
        const { userId, projectId } = req.body
        const data = await ProjectMemberService.acceptInviteToProject(userId, projectId, token as string)
        return new SuccessResponse({
            message: 'Chấp nhận lời mời vào project thành công',
            metadata: data
        }).send(res);
    }

    rejectInvitationController = async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['authorization']?.split(' ')[1]; // Lấy token từ header Authorization
        if (!token) {
            return next(new Error('Token không tồn tại trong header Authorization'));
        }
        const { userId, projectId } = req.body
        const data = await ProjectMemberService.rejectInviteToProject(userId, projectId, token as string)
        return new SuccessResponse({
            message: 'Từ chối lời mời vào project thành công',
            metadata: data
        }).send(res);
    }

    getAllMembersInProjectController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId;
        const userId = req.user?.userId as string;
        const data = await ProjectMemberService.getAllMembersInProject(projectId, userId)
        return new SuccessResponse({
            message: 'Lấy danh sách thành viên trong project thành công',
            metadata: data
        }).send(res);
    }

    removeMemberFromProjectController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const { projectId, userId } = req.body
        const data = await ProjectMemberService.removeMemberFromProject(projectId, userId)
        return new SuccessResponse({
            message: 'Xoá thành viên khỏi project thành công',
            metadata: data
        }).send(res);
    }
}

export default new ProjectMemberController();