// src/seed/rbacSeed.ts
import dataSource from "../config/typeorm.config";
import Roles from "@/models/entities/roles.entity";
import Permissions from "@/models/entities/permissions.entity";
import RolePermissions from "@/models/entities/rolePermissions.entity";

const seedRBAC = async () => {
    try {
        // Khởi tạo database connection
        if (!dataSource.isInitialized) {
            await dataSource.initialize();
        }

        console.log('🌱 Starting RBAC seed...');

        // 1. Seed Permissions
        console.log('📋 Seeding permissions...');
        const permissionRepository = dataSource.getRepository(Permissions);
        
        const permissionsData = [
            // Project permissions
            { name: 'CREATE_PROJECT', description: 'Tạo project mới' },
            { name: 'READ_PROJECT', description: 'Xem thông tin project' },
            { name: 'UPDATE_PROJECT', description: 'Cập nhật thông tin project' },
            { name: 'DELETE_PROJECT', description: 'Xóa project' },
            { name: 'MANAGE_PROJECT_MEMBERS', description: 'Quản lý thành viên project' },
            
            // Board permissions
            { name: 'CREATE_BOARD', description: 'Tạo board mới' },
            { name: 'READ_BOARD', description: 'Xem board' },
            { name: 'UPDATE_BOARD', description: 'Cập nhật board' },
            { name: 'DELETE_BOARD', description: 'Xóa board' },
            
            // List permissions
            { name: 'CREATE_LIST', description: 'Tạo list mới' },
            { name: 'READ_LIST', description: 'Xem list' },
            { name: 'UPDATE_LIST', description: 'Cập nhật list' },
            { name: 'DELETE_LIST', description: 'Xóa list' },
            { name: 'MOVE_LIST', description: 'Di chuyển list' },
            
            // Card permissions
            { name: 'CREATE_CARD', description: 'Tạo card mới' },
            { name: 'READ_CARD', description: 'Xem card' },
            { name: 'UPDATE_CARD', description: 'Cập nhật card' },
            { name: 'DELETE_CARD', description: 'Xóa card' },
            { name: 'MOVE_CARD', description: 'Di chuyển card' },
            { name: 'ASSIGN_CARD', description: 'Gán người làm card' },
            
            // Comment permissions
            { name: 'CREATE_COMMENT', description: 'Tạo comment' },
            { name: 'READ_COMMENT', description: 'Xem comment' },
            { name: 'UPDATE_COMMENT', description: 'Cập nhật comment' },
            { name: 'DELETE_COMMENT', description: 'Xóa comment' },
            
            // File permissions
            { name: 'UPLOAD_FILE', description: 'Upload file' },
            { name: 'DELETE_FILE', description: 'Xóa file' },
            
            // Invite permissions
            { name: 'INVITE_MEMBER', description: 'Mời thành viên mới' },
            { name: 'REMOVE_MEMBER', description: 'Xóa thành viên' },
            { name: 'CHANGE_MEMBER_ROLE', description: 'Thay đổi quyền thành viên' }
        ];

        for (const permData of permissionsData) {
            const existingPermission = await permissionRepository.findOne({ 
                where: { name: permData.name } 
            });
            
            if (!existingPermission) {
                const permission = permissionRepository.create(permData);
                await permissionRepository.save(permission);
                console.log(`  ✓ Created permission: ${permData.name}`);
            } else {
                console.log(`  - Permission already exists: ${permData.name}`);
            }
        }

        // 2. Seed Roles
        console.log('👥 Seeding roles...');
        const roleRepository = dataSource.getRepository(Roles);
        
        const rolesData = [
            { name: 'owner', description: 'Chủ sở hữu project - Có toàn quyền' },
            { name: 'admin', description: 'Quản trị viên project - Quản lý project và members' },
            { name: 'member', description: 'Thành viên project - Có thể tạo và chỉnh sửa nội dung' },
            { name: 'viewer', description: 'Người xem project - Chỉ có quyền xem' }
        ];

        for (const roleData of rolesData) {
            const existingRole = await roleRepository.findOne({ 
                where: { name: roleData.name } 
            });
            
            if (!existingRole) {
                const role = roleRepository.create(roleData);
                await roleRepository.save(role);
                console.log(`  ✓ Created role: ${roleData.name}`);
            } else {
                console.log(`  - Role already exists: ${roleData.name}`);
            }
        }

        // 3. Seed Role-Permission mapping
        console.log('🔗 Seeding role-permission mappings...');
        const rolePermissionRepository = dataSource.getRepository(RolePermissions);

        const rolePermissionMapping = {
            'owner': [
                'CREATE_PROJECT', 'READ_PROJECT', 'UPDATE_PROJECT', 'DELETE_PROJECT', 'MANAGE_PROJECT_MEMBERS',
                'CREATE_BOARD', 'READ_BOARD', 'UPDATE_BOARD', 'DELETE_BOARD',
                'CREATE_LIST', 'READ_LIST', 'UPDATE_LIST', 'DELETE_LIST', 'MOVE_LIST',
                'CREATE_CARD', 'READ_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'MOVE_CARD', 'ASSIGN_CARD',
                'CREATE_COMMENT', 'READ_COMMENT', 'UPDATE_COMMENT', 'DELETE_COMMENT',
                'UPLOAD_FILE', 'DELETE_FILE',
                'INVITE_MEMBER', 'REMOVE_MEMBER', 'CHANGE_MEMBER_ROLE'
            ],
            'admin': [
                'READ_PROJECT', 'UPDATE_PROJECT', 'MANAGE_PROJECT_MEMBERS',
                'CREATE_BOARD', 'READ_BOARD', 'UPDATE_BOARD', 'DELETE_BOARD',
                'CREATE_LIST', 'READ_LIST', 'UPDATE_LIST', 'DELETE_LIST', 'MOVE_LIST',
                'CREATE_CARD', 'READ_CARD', 'UPDATE_CARD', 'DELETE_CARD', 'MOVE_CARD', 'ASSIGN_CARD',
                'CREATE_COMMENT', 'READ_COMMENT', 'UPDATE_COMMENT', 'DELETE_COMMENT',
                'UPLOAD_FILE', 'DELETE_FILE',
                'INVITE_MEMBER', 'REMOVE_MEMBER', 'CHANGE_MEMBER_ROLE'
            ],
            'member': [
                'READ_PROJECT',
                'READ_BOARD',
                'CREATE_LIST', 'READ_LIST', 'UPDATE_LIST', 'MOVE_LIST',
                'CREATE_CARD', 'READ_CARD', 'UPDATE_CARD', 'MOVE_CARD', 'ASSIGN_CARD',
                'CREATE_COMMENT', 'READ_COMMENT', 'UPDATE_COMMENT',
                'UPLOAD_FILE'
            ],
            'viewer': [
                'READ_PROJECT', 'READ_BOARD', 'READ_LIST', 'READ_CARD', 'READ_COMMENT'
            ]
        };

        for (const [roleName, permissions] of Object.entries(rolePermissionMapping)) {
            const role = await roleRepository.findOne({ where: { name: roleName } });
            if (!role) {
                console.log(`  ⚠️  Role ${roleName} not found, skipping...`);
                continue;
            }

            for (const permissionName of permissions) {
                const permission = await permissionRepository.findOne({ 
                    where: { name: permissionName } 
                });
                
                if (!permission) {
                    console.log(`  ⚠️  Permission ${permissionName} not found, skipping...`);
                    continue;
                }

                // Kiểm tra mapping đã tồn tại chưa
                const existingMapping = await rolePermissionRepository.findOne({
                    where: {
                        role: { id: role.id },
                        permission: { id: permission.id }
                    }
                });

                if (!existingMapping) {
                    const rolePermission = rolePermissionRepository.create({
                        role: role,
                        permission: permission
                    });
                    await rolePermissionRepository.save(rolePermission);
                    console.log(`  ✓ Mapped ${role.name} -> ${permission.name}`);
                } else {
                    console.log(`  - Mapping already exists: ${role.name} -> ${permission.name}`);
                }
            }
        }

        console.log('✅ RBAC seed completed successfully!');
        console.log('📊 Summary:');
        console.log(`   - Permissions: ${permissionsData.length}`);
        console.log(`   - Roles: ${rolesData.length}`);
        console.log(`   - Owner permissions: ${rolePermissionMapping.owner.length}`);
        console.log(`   - Admin permissions: ${rolePermissionMapping.admin.length}`);
        console.log(`   - Member permissions: ${rolePermissionMapping.member.length}`);
        console.log(`   - Viewer permissions: ${rolePermissionMapping.viewer.length}`);

    } catch (error) {
        console.error('❌ RBAC seed failed:', error);
        throw error;
    } finally {
        // Đóng connection
        if (dataSource.isInitialized) {
            await dataSource.destroy();
        }
        process.exit(0);
    }
};

// Chạy seed
seedRBAC();