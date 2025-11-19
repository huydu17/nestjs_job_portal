import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = new User();
    Object.assign(user, createUserDto);
    return await this.userRepository.save(user);
  }

  async getUserPermissions(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.role', 'roles.role.permissions'],
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (user.roles.length === 0) {
      return [];
    }
    const permissions = user.roles.flatMap(
      (userRole) => userRole.role.permissions,
    );
    const permMap = new Map<string, Set<string>>();
    permissions.forEach((perm) => {
      const currentActions = permMap.get(perm.resource);
      if (!currentActions) {
        permMap.set(perm.resource, new Set(perm.actions));
      } else {
        perm.actions.forEach((action) => currentActions?.add(action));
      }
    });

    return Array.from(permMap, ([resource, actions]) => ({
      resource,
      actions: Array.from(actions),
    }));
  }

  async findById(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id: userId });
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user;
  }
}
