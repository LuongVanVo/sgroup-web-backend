import Boards from "@/models/entities/boards.entity";
import BoardRepository from "@/models/repositories/boadRepository";
import { BadRequestError } from "@/core/error.response";
import { getInfoData } from "@/utils/getInfoData";

class BoardService {

    static createBoardService = async (board: Boards, projectId: string) => {
        // check name exists trong project
        const existingBoard = await BoardRepository.findBoardByName(board.name)
        if (existingBoard) {
            throw new BadRequestError('Tên board đã tồn tại trong project này.')
        }

        // create board
        board = {
            ...board,
            isDeleted: false,
            lists: [],
            background: "#0079bf",
            position: 1, // Mặc định vị trí ban đầu là 1
        }
        const newBoard = await BoardRepository.createBoard(board, projectId)
        if (!newBoard) {
            throw new BadRequestError('Tạo board thất bại, vui lòng thử lại sau.')
        }

        return getInfoData(['id', 'name', 'background', 'position'], newBoard)
    }

    // lấy tất cả board của mà 1 project sở hữu
    static getAllBoardsOfProjectService = async (projectId: string) => {
        const boards = await BoardRepository.getAllBoardsOfProject(projectId)
        if (!boards) {
            throw new BadRequestError('Lấy danh sách board thất bại, vui lòng thử lại sau.')
        }

        return boards.map(board => 
            getInfoData(['id', 'name', 'background', 'position', 'project', 'lists'], board)
        )
    }

    // lấy thông tin chi tiết của 1 board
    static getBoardDetailsService = async (boardId: string) => {
        const board = await BoardRepository.findBoardById(boardId);
        if (!board) {
            throw new BadRequestError('Board không tồn tại hoặc đã bị xóa.');
        }
        return getInfoData(['id', 'name', 'background', 'position', 'project', 'lists'], board);
    }

    // cập nhật thông tin board
    static updateBoardService = async (boardId: string, boardData: Boards) => {
        // check name exists trong project
        const existingBoard = await BoardRepository.findBoardByName(boardData.name)
        if (existingBoard && existingBoard.id !== boardId) {
            throw new BadRequestError('Tên board đã tồn tại trong project này.')
        }

        // update board
        const updatedBoard = await BoardRepository.updateBoard(boardId, boardData)
        if (!updatedBoard) {
            throw new BadRequestError('Cập nhật board thất bại, vui lòng thử lại sau.')
        }
        const board = await BoardRepository.findBoardById(boardId)
        return getInfoData(['id', 'name', 'background', 'position', 'project', 'lists'], board)
    }

    // Xóa board
    static deleteBoardService = async (boardId: string) => {
        // find board
        const foundBoard = await BoardRepository.findBoardById(boardId)
        if (!foundBoard) {
            throw new BadRequestError('Board không tồn tại.')
        }
        if (foundBoard.isDeleted) {
            throw new BadRequestError('Board đã bị xóa trước đó.')
        }
        // soft delete board
        foundBoard.isDeleted = true
        const deletedBoard = await BoardRepository.updateBoard(boardId, foundBoard)
        if (!deletedBoard) {
            throw new BadRequestError('Xóa board thất bại, vui lòng thử lại sau.')
        }
        return getInfoData(['id', 'name', 'background', 'position'], foundBoard)
    }
}

export default BoardService;