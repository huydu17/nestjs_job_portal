import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const { permissions, isSystem, ...roleData } = createRoleDto;
    const roleExists = await this.getRoleByName(roleData.name);
    if (roleExists) {
      throw new BadRequestException(
        `Role with name ${roleData.name} already exists`,
      );
    }
    const permissionEntities = permissions.map((p) =>
      this.permissionRepository.create(p),
    );
    const newRole = this.roleRepository.create({
      ...roleData,
      permissions: permissionEntities,
      isSystem: isSystem ?? false,
    });
    return this.roleRepository.save(newRole);
  }

  findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.getRoleById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const { permissions, ...roleData } = updateRoleDto;
    return this.dataSource.transaction(async (manager) => {
      const roleRepo = manager.getRepository(Role);
      const permRepo = manager.getRepository(Permission);

      const role = await roleRepo.findOne({ where: { id } });
      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      Object.assign(role, roleData);
      if (permissions) {
        await permRepo.delete({ role: { id } });
        const newPermissions = permissions.map((p) => permRepo.create(p));
        role.permissions = newPermissions;
      }
      return roleRepo.save(role);
    });
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    if (role.isSystem) {
      throw new ForbiddenException('Cannot delete system role:', role);
    }
    await this.roleRepository.remove(role);
  }

  async getRoleById(roleId: number) {
    return await this.roleRepository.findOneBy({ id: roleId });
  }

  async getRoleByName(roleName: string): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ name: roleName });
  }
}
