import ProjectMembers from "@/models/entities/projectMembers.entity";
import dataSource from "@/config/typeorm.config";

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
}

export default ProjectMemberRepository;