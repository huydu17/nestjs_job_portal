import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from '@users/entities/user.entity';
import { AuthorizationGuard } from 'src/common/guards/authoriztion.guard';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Resource } from '@roles/enums/resource.enum';
import { Action } from '@roles/enums/action.enum';

@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}
  @Post()
  @Permissions([{ resource: Resource.USERROLES, actions: [Action.CREATE] }])
  create(@Body() data: AssignRoleDto, @CurrentUser() user: User) {
    return this.userRolesService.assignRoleToUser(data, user.id);
  }

  @Get(':userId')
  @Permissions([{ resource: Resource.USERROLES, actions: [Action.READ] }])
  findRolesByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userRolesService.getUserRoles(userId);
  }
}
