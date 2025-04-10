import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreatePermissionDto, CreateRoleDto } from './dto/create-role-permission.dto';
import { Premissions } from './decorators/premissions.decorator';
import { Premission } from './premission.type';
import { AddPermissionsToRoleDto } from './dto/add-permission-to-role.dto';


@ApiTags('Roles')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
@Controller('role')
export class RoleController {
    constructor(
        private readonly roleService: RoleService,
    ) {}
    @Premissions(Premission.CreateRole)
    @Post()
    @ApiOperation({ summary: 'Добавить Роль' })
    async createRole(@Body() createRoleDTO: CreateRoleDto) {
        return this.roleService.addRole(createRoleDTO)
    }

    @Premissions(Premission.CreatePermission)
    @Post('permission')
    @ApiOperation({ summary: 'Добавить Разрешение' })
    async createPermission(@Body() createPermissionDTO: CreatePermissionDto) {
        return this.roleService.addPermission(createPermissionDTO)
    }

    @Premissions(Premission.AddPermissionToRole)
    @Post(':id/permissions')
    @ApiOperation({ summary: 'Добавить Разрешение для Роли' })
    @HttpCode(200)
    async addPermissions(
        @Param('id', ParseIntPipe) roleId: number,
        @Body() dto: AddPermissionsToRoleDto
    ) {
        return this.roleService.addPermissionsToRole(roleId, dto);
    }

    @Premissions(Premission.FindRoles)
    @Get('roles')
    @HttpCode(200)
    @ApiOperation({ summary: 'Получить все Роли' })
    async findAllRole() {
        return this.roleService.findAllRole()
    }

    @Premissions(Premission.FindPermissions)
    @Get('permissions')
    @HttpCode(200)
    @ApiOperation({ summary: 'Получить все Разрешения' })
    async findAllPermission() {
        return this.roleService.findAllPermissions()
    }

}
