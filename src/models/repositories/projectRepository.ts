import Project from "@/models/entities/projects.entity";
import dataSource from "@/config/typeorm.config";

class ProjectRepository {
    static findProjectByNameAndOwner = async (name: string, ownerId: string) => {
        return await dataSource.getRepository(Project).findOne({
            where: {
                name: name,
                owner: { id: ownerId }
            }
        })
    }

    static createProject = async (project: Project) => {
        return await dataSource.getRepository(Project).save(project)
    }

    static getAllProjectsOfOwner = async (ownerId: string) => {
        return await dataSource.getRepository(Project).find({
            where: {
                owner: { id: ownerId },
                isDeleted: false
            },
            relations: [
                'owner',
                'boards',
                'projectMembers',            // danh sách membership
                'projectMembers.user',       // thông tin user
                'projectMembers.role'        // thông tin role
            ],
            order: { createdAt: 'DESC' }
        })
    }

    static findProjectById = async (projectId: string) => {
        return await dataSource.getRepository(Project).findOne({
            where: {
                id: projectId,
                isDeleted: false
            },
            relations: [
                'owner',
                'boards',
                'projectMembers',
                'projectMembers.user',
                'projectMembers.role'
            ]
        })
    }

    static updateProject = async (projectId: string, project: Project) => {
        return await dataSource.getRepository(Project).update(projectId, project)
    }

    static deleteProject = async (projectId: string) => {
        return await dataSource.getRepository(Project).delete(projectId);
    }
}

export default ProjectRepository;