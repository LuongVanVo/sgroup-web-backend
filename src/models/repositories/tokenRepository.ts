import Token from "@/models/entities/tokens.entity";
import dataSource from "@/config/typeorm.config";

export const saveToken = async (token: Token) => {
    return await dataSource.getRepository(Token).save(token);
}

export const findTokenByValue = async (tokenValue: string) => {
    return await dataSource.getRepository(Token).findOneBy({ token: tokenValue });
}