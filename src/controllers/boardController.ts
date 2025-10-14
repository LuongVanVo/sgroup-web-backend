import BoardService from "@/services/boardService";
import { SuccessResponse } from "@/core/success.response"
import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "@/middlewares/authenticationCookie";
import Boards from "@/models/entities/boards.entity";

class boardController {

    createBoardController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId;
        const data = await BoardService.createBoardService(req.body as Boards, projectId)
        new SuccessResponse({
            message: 'Tạo board thành công.',
            metadata: data
        }).send(res);
    }

    getAllBoardsOfProjectController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const projectId = req.params.projectId;
        const data = await BoardService.getAllBoardsOfProjectService(projectId)
        new SuccessResponse({
            message: 'Lấy danh sách board thành công.',
            metadata: data
        }).send(res);
    }

    getBoardDetailsController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const boardId = req.params.boardId;
        const data = await BoardService.getBoardDetailsService(boardId);
        new SuccessResponse({
            message: 'Lấy thông tin board thành công.',
            metadata: data
        }).send(res);
    }

    updateBoardController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const boardId = req.params.boardId;
        const boardData = req.body as Boards;
        const data = await BoardService.updateBoardService(boardId, boardData);
        new SuccessResponse({
            message: 'Cập nhật board thành công.',
            metadata: data
        }).send(res);
    }

    deleteBoardController = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const boardId = req.params.boardId;
        const data = await BoardService.deleteBoardService(boardId);
        new SuccessResponse({
            message: 'Xóa board thành công.',
            metadata: data
        }).send(res);
    }
}

export default new boardController();