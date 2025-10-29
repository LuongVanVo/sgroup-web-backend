import MailTemplates from "../entities/mailTemplates.entity";
import dataSource from "@/config/typeorm.config";

export const getMailTemplateVerifyAccount = async () => {
    return await dataSource.getRepository(MailTemplates).findOne({ where: { trigger: 1 } });
}

export const getEmailTemplateInviteMemberToProject = async () => {
    return await dataSource.getRepository(MailTemplates).findOne({ where: { trigger: 2 } });
}

export const getEmailTemplate = async (trigger: number) => {
    return await dataSource.getRepository(MailTemplates).findOne({ where: { trigger } });
}