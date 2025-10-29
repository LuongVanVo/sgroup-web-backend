import { BadRequestError } from "@/core/error.response";
import ProjectMembers from "@/models/entities/projectMembers.entity";
import { getEmailTemplate, getEmailTemplateInviteMemberToProject } from "@/models/repositories/mailRepository";
import ProjectMemberRepository from "@/models/repositories/projectMemberRepository";
import ProjectRepository from "@/models/repositories/projectRepository";
import { generateInviteToken, generateJwt } from "@/utils/jsonwebtoken";
import { sendActivationEmail } from "./mailService";
import { getInfoData } from "@/utils/getInfoData";
import UserRepository from "@/models/repositories/userRepository";
import RolesRepository from "@/models/repositories/rolesRepository";

import dotenv from "dotenv";
dotenv.config();

class ProjectMemberService {

    static inviteMemberInProject = async (userId: string, projectId: string) => {
        // check project exists
        const foundProject = await ProjectRepository.findProjectById(projectId)
        if (!foundProject) {
            throw new BadRequestError('Project không tồn tại.')
        }

        // check userId đã là member của project chưa
        const isExistingMemberInProject = await ProjectMemberRepository.isExistingMemberInProject(userId, projectId)
        if (isExistingMemberInProject) {
            throw new BadRequestError('Thành viên đã là member của project.')
        }

        const emailInviteUser = await UserRepository.findUserById(userId)
        if (!emailInviteUser) {
            throw new BadRequestError('User mời không tồn tại trong hệ thống, vui lòng kiểm tra lại.')
        }

        const memberRole = await RolesRepository.findRoleByName('member')
        if (!memberRole) {
            throw new BadRequestError('Role member không tồn tại trong hệ thống, vui lòng liên hệ quản trị viên.')
        }

        // Tạo ra project member với trạng thái 'pending'
        const newProjectMember = await ProjectMemberRepository.createProjectMember({
            projectId,
            userId,
            role: { id: memberRole.id }, // Gán role cho thành viên mới
            status: 'pending' // trạng thái mời tham gia
        } as ProjectMembers);
        
        if (!newProjectMember) {
            throw new BadRequestError('Không thể mời thành viên vào project.')
        }

        // Sinh ra invite token và gửi email mời tham gia project
        const inviteToken = generateInviteToken({ userId, projectId }, '7d'); // token có hạn 7 ngày
        const inviteUrl = `${process.env.CLIENT_URL}/invite?token=${inviteToken}`;
        
        const templateEmailInviteMember = await getEmailTemplateInviteMemberToProject()
        if (!templateEmailInviteMember) {
            throw new BadRequestError('Template email mời tham gia project không tồn tại trong hệ thống, vui lòng liên hệ quản trị viên.')
        }
        const htmlBody = templateEmailInviteMember.content.replace('{{inviteUrl}}', inviteUrl)

        await sendActivationEmail(emailInviteUser.email, templateEmailInviteMember.subject, htmlBody)

        // Lưu invitation token vào project member
        newProjectMember.invitationToken = inviteToken;
        await ProjectMemberRepository.updateProjectMember(newProjectMember);

        return getInfoData(['id', 'projectId', 'userId', 'status'], newProjectMember);
    }

    static acceptInviteToProject = async (userId: string, projectId: string, token: string) => {
        const foundProjectMember = await ProjectMemberRepository.findProjectMember(projectId, userId)
        if (!foundProjectMember) {
            throw new BadRequestError('Project member không tồn tại.')
        }
        
        // Verify token hợp lệ
        if (!Object.is(foundProjectMember.invitationToken, token)) {
            throw new BadRequestError('Token không hợp lệ.')
        }
        if (!Object.is(foundProjectMember.status, 'pending')) {
            throw new BadRequestError('Bạn đã phản hồi lời mời tham gia project này rồi.')
        }
        foundProjectMember.status = 'accepted'
        await ProjectMemberRepository.updateProjectMember(foundProjectMember)

        return getInfoData(['id', 'projectId', 'userId', 'status'], foundProjectMember);
    }

    static rejectInviteToProject = async (userId: string, projectId: string, token: string) => {
        const foundProjectMember = await ProjectMemberRepository.findProjectMember(projectId, userId)
        if (!foundProjectMember) {
            throw new BadRequestError('Project member không tồn tại.')
        }
        if (!Object.is(foundProjectMember.invitationToken, token)) {
            throw new BadRequestError('Token không hợp lệ.')
        }
        if (!Object.is(foundProjectMember.status, 'pending')) {
            throw new BadRequestError('Bạn đã phản hồi lời mời tham gia project này rồi.')
        }

        foundProjectMember.status = 'rejected'
        await ProjectMemberRepository.updateProjectMember(foundProjectMember)

        return getInfoData(['id', 'projectId', 'userId', 'status'], foundProjectMember);
    }

    static getAllMembersInProject = async (projectId: string, userId: string) => {
        // chỉ những member trong project mới có thể xem danh sách member, và chỉ lấy các member đã accepted
        // check user có phải member của project không
        const isMemberOfProject = await ProjectMemberRepository.isExistingMemberInProject(userId, projectId)
        if (!isMemberOfProject) {
            throw new BadRequestError('Bạn không phải thành viên của project này.')
        }

        // lấy danh sách member của project
        const memberOfProject = await ProjectMemberRepository.getMembersByProjectId(projectId)
        if (!memberOfProject) {
            throw new BadRequestError('Lấy danh sách thành viên trong project thất bại, vui lòng thử lại sau.')
        }

        // chỉ trả về những member đã accepted
        const acceptedMembers = memberOfProject.filter(m => m.status === 'accepted')
        return acceptedMembers.map(m => getInfoData(['id', 'userId', 'projectId', 'status', 'role.name', 'user.id', 'user.name', 'user.email'], m))
    }

    // Xóa member khỏi project
    static removeMemberFromProject = async (projectId: string, userId: string) => {
        const foundProject = await ProjectRepository.findProjectById(projectId)
        
        if (!foundProject) {
            throw new BadRequestError('Project không tồn tại.')
        }
        const foundProjectMember = await ProjectMemberRepository.findProjectMember(projectId, userId)
        if (!foundProjectMember) {
            throw new BadRequestError('Thành viên không tồn tại trong project.')
        }

        // Không thể tự xóa mình khỏi project
        if (Object.is(foundProject.owner.id, userId)) {
            throw new BadRequestError('Chủ dự án không thể tự xóa mình khỏi dự án.')
        }

        // chỉ xóa member đã accepted
        if (!Object.is(foundProjectMember.status, 'accepted')) {
            throw new BadRequestError('Thành viên này chưa có trong project.')
        }

        const deleteMember = await ProjectMemberRepository.removeProjectMember(projectId, userId)
        if (!deleteMember) {
            throw new BadRequestError('Xóa thành viên khỏi project thất bại, vui lòng thử lại sau.')
        }
        
        // Gửi mail thông báo cho user đã bị xóa khỏi project 
        const emailTemplateRemoveMember = await getEmailTemplate(3) 
        if (!emailTemplateRemoveMember) {
            throw new BadRequestError('Template email thông báo không tồn tại trong hệ thống, vui lòng liên hệ quản trị viên.')
        }

        const subject = emailTemplateRemoveMember.subject.replace('{{projectName}}', foundProject.name)
        const htmlBody = emailTemplateRemoveMember.content.replace('{{name}}', foundProjectMember.user.name)
                                                                    .replace('{{projectName}}', foundProject.name)
        await sendActivationEmail(foundProjectMember.user.email, subject, htmlBody)

        return getInfoData(['id', 'userId', 'projectId', 'foundProjectMember.projects.name'], foundProjectMember);
    }
}

export default ProjectMemberService;