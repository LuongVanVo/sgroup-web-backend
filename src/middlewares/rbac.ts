import { Response, NextFunction } from "express"
import { AuthenticatedRequest } from "./authenticationCookie"
import ProjectRepository from "@/models/repositories/projectRepository"
import ProjectMemberRepository from "@/models/repositories/projectMemberRepository"
import RoleRepository from "@/models/repositories/rolesRepository"

export type RoleName = 'owner' | 'admin' | 'member' | 'viewer'

// Load role của user trong project
export const loadProjectRole = (getProjectId: (req: AuthenticatedRequest) => string) => 
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId as string
      if (!userId) return res.status(401).json({ success: false, message: 'Vui lòng đăng nhập.' })

      const projectId = getProjectId(req)
      if (!projectId) return res.status(400).json({ success: false, message: 'Project ID không hợp lệ.' })

      const project = await ProjectRepository.findProjectById(projectId)
      if (!project || project.isDeleted) {
        return res.status(404).json({ success: false, message: 'Project không tồn tại hoặc đã bị xóa.' })
      }

      let role: RoleName | undefined
      if (project.owner?.id === userId) {
        role = 'owner'
      } else {
        const member = await ProjectMemberRepository.findProjectMember(projectId, userId)
        if (member?.role?.name) role = member.role.name as RoleName
      }

      if (!role) {
        return res.status(403).json({ success: false, message: 'Bạn không có quyền truy cập vào project này.' })
      }

      req.projectAuth = { projectId, role }
      return next()
    } catch (error) {
      return next(error)
    }
  }

// Middleware 1: Check role (tên role từ DB)
export const checkRole = (allowedRoles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const currentRole = req.projectAuth?.role

      if (!currentRole) {
        return res.status(403).json({
          success: false,
          message: 'Không xác định được role của bạn.'
        })
      }

      if (!allowedRoles.includes(currentRole)) {
        return res.status(403).json({
          success: false,
          message: `Chỉ ${allowedRoles.join(', ')} mới có quyền thực hiện hành động này.`
        })
      }

      return next()
    } catch (error) {
      return next(error)
    }
  }
}

// Middleware 2: Check permission (tên permission từ DB)
export const checkPermission = (requiredPermissions: string | string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const currentRole = req.projectAuth?.role

      if (!currentRole) {
        return res.status(403).json({
          success: false,
          message: 'Không xác định được role của bạn.'
        })
      }

      // Lấy role từ DB kèm permissions
      const roleWithPermissions = await RoleRepository.findRoleByNameWithPermissions(currentRole)
      
      if (!roleWithPermissions) {
        return res.status(403).json({
          success: false,
          message: 'Role không hợp lệ.'
        })
      }

      // Lấy danh sách permission names của role
      const rolePermissions = roleWithPermissions.permissions?.map(p => p.name) || []

      // Convert required permissions to array
      const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions]

      // Check có đủ permissions không
      const hasAllPermissions = permissions.every(p => rolePermissions.includes(p))

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          message: 'Bạn không có quyền thực hiện hành động này.'
        })
      }

      return next()
    } catch (error) {
      return next(error)
    }
  }
}