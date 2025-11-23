import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/role.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Role } from './enums/role.enum';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { RoleResponseDto } from './entities/role-response';

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @Serialize(RoleResponseDto)
  @ApiOperation({ summary: 'Create a new role (Admin only)' })
  @ResponseMessage('Role created successfully')
  @ApiResponse({ status: 201, description: 'Role created.' })
  @ApiResponse({ status: 400, description: 'Role already exists.' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @Serialize(RoleResponseDto)
  @ApiOperation({ summary: 'Get list of all roles (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of roles.' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @Serialize(RoleResponseDto)
  @ApiOperation({ summary: 'Get role details (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, description: 'Role details.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @Serialize(RoleResponseDto)
  @ApiOperation({ summary: 'Update role (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Role updated successfully')
  @ApiResponse({ status: 200, description: 'Role updated.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete role (Admin only)' })
  @ApiParam({ name: 'id', example: 1 })
  @ResponseMessage('Role deleted successfully')
  @ApiResponse({ status: 200, description: 'Role deleted.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
