import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from '@roles/enums/role.enum';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { RoleResponseDto } from '@roles/entities/role-response';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';

@ApiTags('User Roles')
@ApiBearerAuth()
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}
  @Post()
  @Roles(Role.ADMIN)
  @Serialize(RoleResponseDto)
  @ApiOperation({ summary: 'Assign roles to a user (Admin only)' })
  @ResponseMessage('Roles assigned successfully')
  @ApiResponse({ status: 201, description: 'Roles assigned.' })
  @ApiResponse({ status: 400, description: 'User not found or Invalid role.' })
  create(@Body() data: AssignRoleDto, @CurrentUser() user: AuthUser) {
    return this.userRolesService.assignRoleToUser(data, user.id);
  }

  @Get(':userId')
  @Roles(Role.ADMIN)
  @Serialize(RoleResponseDto)
  @ApiOperation({ summary: 'Get roles of a specific user (Admin only)' })
  @ApiParam({ name: 'userId', example: 10 })
  @ApiResponse({ status: 200, description: 'List of roles belonging to user.' })
  findRolesByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.userRolesService.getUserRoles(userId);
  }
}
