import MailTemplates from "../entities/mailTemplates.entity";
import dataSource from "@/config/typeorm.config";

export const getMailTemplateVerifyAccount = async () => {
    return await dataSource.getRepository(MailTemplates).findOne({ where: { trigger: 1 } });
}