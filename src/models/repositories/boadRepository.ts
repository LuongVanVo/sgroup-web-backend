import Boards from "../entities/boards.entity";
import dataSource from "@/config/typeorm.config";

class BoardRepository {
    static findBoardByName = async (name: string) => {
        return await dataSource.getRepository(Boards).findOne({
            where: { name }
        })
    }

    static createBoard = async (board: Boards, projectId: string) => {
        board.project = { id: projectId } as any; 
        return await dataSource.getRepository(Boards).save(board);
    }

    static getAllBoardsOfProject = async (projectId: string) => {
        return await dataSource.getRepository(Boards).find({
            where: { project: { id: projectId }, isDeleted: false },
            relations: ['project', 'lists'],
            order: { position: 'ASC' }
        })
    }

    static findBoardById = async (boardId: string) => {
        return await dataSource.getRepository(Boards).findOne({
            where: { id: boardId, isDeleted: false },
            relations: ['project']
        })
    }

    static updateBoard = async (boardId: string, boardData: Partial<Boards>) => {
        const result = await dataSource.getRepository(Boards).update(
            { id: boardId }, 
            boardData
        );

        if (result.affected === 0) {
            return null; // Không tìm thấy board để update
        }

        return await dataSource.getRepository(Boards).findOne({
            where: { id: boardId },
            relations: ['project']
        });
    }
}

export default BoardRepository;