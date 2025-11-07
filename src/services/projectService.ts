import Project from "@/models/entities/projects.entity";
import { BadRequestError } from "@/core/error.response";
import { getInfoData } from "@/utils/getInfoData";
import ProjectRepository from "@/models/repositories/projectRepository";
import ProjectMembers from "@/models/entities/projectMembers.entity";
import RolesRepository from "@/models/repositories/rolesRepository";
import ProjectMemberRepository from "@/models/repositories/projectMemberRepository";

class ProjectService {

    static createProjectService = async (project: Project) => {
        // check name exists: project cùng owner không được trùng tên, còn 2 user khác nhau thì được trùng tên
        const existingProject = await ProjectRepository.findProjectByNameAndOwner(project.name, project.owner.id)
        if (existingProject) {
            throw new BadRequestError('Tên project đã tồn tại trong tài khoản của bạn.')
        }
        // create project
        project = {
            ...project,
            isDeleted: false,
            boards: [],
            projectMembers: []
        }
        const newProject = await ProjectRepository.createProject(project)
        if (!newProject) {
            throw new BadRequestError('Tạo project thất bại, vui lòng thử lại sau.')
        }

        const ownerRole = await RolesRepository.findRoleByName('owner');
        if (!ownerRole) {
            throw new BadRequestError('Vai trò owner không tồn tại trong hệ thống, vui lòng liên hệ quản trị viên.')
        }

        // ở project_member thì sẽ tự động thêm owner vào
        const projectMember = new ProjectMembers()
        projectMember.projectId = newProject.id
        projectMember.userId = project.owner.id
        projectMember.project = newProject
        projectMember.user = project.owner
        projectMember.status = 'accepted' // owner thì luôn là accepted
        projectMember.role = ownerRole

        // save project member
        const savedProjectMember = await ProjectMemberRepository.createProjectMember(projectMember)
        if (!savedProjectMember) {
            // Rollback: xóa project vừa tạo nếu thêm owner vào project_member thất bại
            await ProjectRepository.deleteProject(newProject.id);
            throw new BadRequestError('Thêm owner vào project thất bại, vui lòng thử lại sau.')
        }
        return getInfoData(['id', 'name', 'description', 'owner.name'], newProject)
    }

    // lấy tất cả project của mà 1 owner sở hữu
    static getAllProjectsOfOwnerService = async (ownerId: string) => {
        const projects = await ProjectRepository.getAllProjectsOfOwner(ownerId)
        if (!projects) {
            throw new BadRequestError('Lấy danh sách project thất bại, vui lòng thử lại sau.')
        }

        return projects.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        owner: { id: p.owner.id, name: p.owner.name, email: p.owner.email },
        boards: p.boards?.map(b => ({ id: b.id, name: b.name })) ?? [],
        members: p.projectMembers?.map(m => ({
            id: m.userId,
            status: m.status,
            role: m.role?.name,
            user: { id: m.user?.id, name: m.user?.name, email: m.user?.email }
        })) ?? []
        }))
    }

    // Lấy tất cả project của 1 member
    static getAllProjectsOfMemberService = async (userId: string) => {        // lấy tất cả project mà user là member
        const projectMembers = await ProjectMemberRepository.getProjectsByUserId(userId);
        if (!projectMembers) {
            throw new BadRequestError('Lấy danh sách project thất bại, vui lòng thử lại sau.');
        }

        const members = await ProjectMemberRepository.getMembersByProjectId(projectMembers.map(pm => pm.project.id)[0]);
        return projectMembers.map(pm => ({
            id: pm.project.id,
            name: pm.project.name,  
            description: pm.project.description,
            owner: { id: pm.project.owner.id, name: pm.project.owner.name, email: pm.project.owner.email },
            boards: pm.project.boards?.map(b => ({ id: b.id, name: b.name,  })) ?? [],
            // get all members of project
            members: members.map(m => ({
                user: { id: m.user?.id, name: m.user?.name, email: m.user?.email }
            })) ?? []
        }))
    }

    static updateProjectService = async (projectId: string, project: Project) => {
        // check name exists: project cùng owner không được trùng tên, còn 2 user khác nhau thì được trùng tên
        if (project.name) {
            const currentProject = await ProjectRepository.findProjectById(projectId)
            if (!currentProject) {
                throw new BadRequestError('Project không tồn tại.')
            }

            // check trùng tên với project khác của cùng owner
            const existingProject = await ProjectRepository.findProjectByNameAndOwner(project.name, currentProject.owner.id)
            if (existingProject && existingProject.id !== projectId) {
                throw new BadRequestError('Tên project đã tồn tại trong các project của bạn. Vui lòng chọn tên khác.')
            }

            // update project
            const updateProject = await ProjectRepository.updateProject(projectId, project)
            if (!updateProject) {
                throw new BadRequestError('Cập nhật project thất bại, vui lòng thử lại sau.')
            }
            return getInfoData(['id', 'name', 'description', 'owner.name'], { ...currentProject, ...project })
        }
    }

    static deleteProjectService = async (projectId: string, userId: string) => { 
    // find project
        const foundProject = await ProjectRepository.findProjectById(projectId)
        if (!foundProject) {
            throw new BadRequestError('Project không tồn tại.')
        }

        if (foundProject.isDeleted) {
            throw new BadRequestError('Project đã bị xóa trước đó.')
        }

        // Kiểm tra user thực tế đang request, KHÔNG phải owner của project
        const projectMember = await ProjectMemberRepository.findProjectMember(projectId, userId)
        if (!projectMember) {
            throw new BadRequestError('Bạn không phải là thành viên của project này.')
        }

        // Kiểm tra role của user request
        if (projectMember.role.name !== 'owner') {
            throw new BadRequestError('Chỉ chủ sở hữu (owner) mới được quyền xóa project.')
        }

        // soft delete project
        foundProject.isDeleted = true
        const deletedProject = await ProjectRepository.updateProject(projectId, foundProject)
        if (!deletedProject) {
            throw new BadRequestError('Xóa project thất bại, vui lòng thử lại sau.')
        }
        
        return getInfoData(['id', 'name', 'description', 'owner.name'], deletedProject)
    }
}

export default ProjectService;