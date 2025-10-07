import 'reflect-metadata'
import { DataSource } from 'typeorm'
import User from '@/models/entities/users.entity'
import path from 'path'
import dotenv from 'dotenv'
import Boards  from '@/models/entities/boards.entity'
import Cards  from '@/models/entities/cards.entity'
import CardMembers  from '@/models/entities/card_members.entity'
import Comments  from '@/models/entities/comments.entity'
import Lists  from '@/models/entities/lists.entity'
import MailTemplates  from '@/models/entities/mailTemplates.entity'
import Notifications  from '@/models/entities/notifications.entity'
import Permissions  from '@/models/entities/permissions.entity'
import Roles  from '@/models/entities/roles.entity'
import RolePermissions  from '@/models/entities/rolePermissions.entity'
import Project  from '@/models/entities/projects.entity'
import ProjectMembers  from '@/models/entities/projectMembers.entity'
import Token  from '@/models/entities/tokens.entity'
dotenv.config()

export default new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        User,
        Boards,
        Cards,
        CardMembers,
        Comments,
        Lists,
        MailTemplates,
        Notifications,
        Permissions,
        Roles,
        RolePermissions,
        Project,
        ProjectMembers,
        Token
    ],
    migrationsTableName: 'migrations',
    migrations: [path.join(__dirname, '..', 'migration', '*.{ts,js}')],
    synchronize: true,
    logging: false,
})