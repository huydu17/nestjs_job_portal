import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignRoleDto } from './dto/assign-role.dto';
import { Repository } from 'typeorm';
import { UserRole } from './entities/user-role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '@users/user.service';
import { Role } from '@roles/enums/role.enum';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
    private readonly userService: UserService,
  ) {}

  async assignRoleToUser(data: AssignRoleDto, currentUserId: number) {
    const { userId, roleIds } = data;
    const userExists = await this.userService.findById(userId);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }
    const currentAssignments = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });
    const currentRoleIds = currentAssignments.map((a) => a.roleId);
    const rolesToAdd = roleIds.filter((id) => !currentRoleIds.includes(id));
    const assignmentsToRemove = currentAssignments.filter(
      (a) => !roleIds.includes(a.roleId),
    );
    await this.userRoleRepository.manager.transaction(
      async (transactionalEntityManager) => {
        for (const assignment of assignmentsToRemove) {
          if (assignment.role.name === Role.ADMIN.toString()) {
            if (userId === currentUserId) {
              throw new BadRequestException(
                'Cannot remove your own ADMIN role.',
              );
            }
            const adminCount = await transactionalEntityManager.count(
              UserRole,
              {
                where: { roleId: assignment.roleId },
              },
            );
            if (adminCount <= 1) {
              throw new BadRequestException(
                'Cannot remove the last ADMIN role.',
              );
            }
          }
          await transactionalEntityManager.remove(assignment);
        }
        if (rolesToAdd.length > 0) {
          const newAssignments = rolesToAdd.map((roleId) =>
            this.userRoleRepository.create({ userId, roleId }),
          );
          await transactionalEntityManager.save(newAssignments);
        }
      },
    );
    return this.getUserRoles(data.userId);
  }

  async getUserRoles(userId: number) {
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });
    return userRoles.map((ur) => ur.role);
  }
}
