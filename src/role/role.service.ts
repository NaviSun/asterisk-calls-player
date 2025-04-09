import { Injectable } from '@nestjs/common';
import { RoleEntity } from './entity/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionEntity } from './entity/permission.entity';
import { CreatePermissionDto, CreateRoleDto } from './dto/create-role-permission.dto';

@Injectable()
export class RoleService {
      constructor(
        @InjectRepository(RoleEntity)
        private readonly roleRepository: Repository<RoleEntity>,
        @InjectRepository(PermissionEntity)
        private readonly permissionRepository: Repository<PermissionEntity>,
      ) {}

      async addRole(dto: CreateRoleDto): Promise<RoleEntity> {
        const role = this.roleRepository.create(dto)
        return this.roleRepository.save(role)
      }

      async addPermission(dto: CreatePermissionDto): Promise<PermissionEntity> {
        const role = this.permissionRepository.create(dto)
        return this.permissionRepository.save(role)
      }
}
