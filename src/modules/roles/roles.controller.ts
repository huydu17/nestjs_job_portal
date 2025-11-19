import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Permissions } from 'src/common/decorators/permission.decorator';
import { Resource } from './enums/resource.enum';
import { Action } from './enums/action.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthorizationGuard } from 'src/common/guards/authoriztion.guard';

@UseGuards(JwtAuthGuard, AuthorizationGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions([{ resource: Resource.ROLES, actions: [Action.CREATE] }])
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.READ] }])
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.UPDATE] }])
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions([{ resource: Resource.ROLES, actions: [Action.DELETE] }])
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }
}
