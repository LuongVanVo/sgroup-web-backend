import ProjectMembers from "@/models/entities/projectMembers.entity";
import dataSource from "@/config/typeorm.config";
import { use } from "passport";

class ProjectMemberRepository {
    static createProjectMember = async (projectMember: ProjectMembers) => {
        return await dataSource.getRepository(ProjectMembers).save(projectMember);
    }

    static findProjectMember = async (projectId: string, userId: string) => {
        return await dataSource.getRepository(ProjectMembers).findOne({
            where: {
                projectId: projectId,
                userId: userId
            },
            relations: ['user', 'role', 'project']
        });
    }

    static removeProjectMember = async (projectId: string, userId: string) => {
        return await dataSource.getRepository(ProjectMembers).delete({
            projectId: projectId,
            userId: userId
        });
    }

    static isExistingMemberInProject = async (userId: string, projectId: string) => {
        const count = await dataSource.getRepository(ProjectMembers).count({
            where: {
                userId: userId,
                projectId: projectId
            }
        });
        return count > 0
    }

    static updateProjectMember = async (projectMember: ProjectMembers) => {
        return await dataSource.getRepository(ProjectMembers).save(projectMember);
    }

    static getMembersByProjectId = async (projectId: string) => {
        return await dataSource.getRepository(ProjectMembers).find({
            where: { project: { id: projectId } },
            relations: ['user', 'role']
        });
    }

    // Lấy tất cả project mà user là member
    static getProjectsByUserId = async (userId: string) => {
        return await dataSource.getRepository(ProjectMembers).find({
            where: { user: { id: userId } },
            relations: ['project', 'role', 'project.boards', 'user']
        })
    }
}

export default ProjectMemberRepository;