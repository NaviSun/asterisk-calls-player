import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RoleEntity } from './entity/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, QueryRunner, Repository } from 'typeorm';
import { PermissionEntity } from './entity/permission.entity';
import { CreatePermissionDto, CreateRoleDto } from './dto/create-role-permission.dto';
import { AddPermissionsToRoleDto } from './dto/add-permission-to-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    private readonly dataSource: DataSource,
  ) { }

  async addRole(dto: CreateRoleDto): Promise<RoleEntity> {
    try {
      const role = this.roleRepository.create(dto)
      return this.roleRepository.save(role)
    } catch (error) {
      const pgUniqueViolationErrorCode = '23505'
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException("Такая роль существует");
      }
      throw error;
    }
  }

  async addPermission(dto: CreatePermissionDto): Promise<PermissionEntity> {
    const role = this.permissionRepository.create(dto)
    return this.permissionRepository.save(role)
  }

  async findRoleById(id: number[]) {
    return this.roleRepository.find({ where: { id: In(id) } })
  }

  async findAllRole() {
    return this.roleRepository.find();
  }

  async findAllPermissions() {
    return this.permissionRepository.find();
  }

  async addPermissionsToRole(
    roleId: number,
    dto: AddPermissionsToRoleDto
  ): Promise<RoleEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Находим роль
      const role = await queryRunner.manager.findOne(RoleEntity, {
        where: { id: roleId },
        relations: ['permissions'],
      });

      if (!role) {
        throw new NotFoundException(`Роль с ID ${roleId} не найдена`);
      }

      // 2. Находим разрешения через репозиторий с транзакцией
      const permissions = await queryRunner.manager.find(PermissionEntity, {
        where: { id: In(dto.permissionIds) },
      });
      if (permissions === undefined) {
        throw new NotFoundException(
          `Разрешения не найдены`
        );
      }
      // 3. Проверяем существование всех permissions
      if (permissions.length !== dto.permissionIds.length) {
        const foundIds = permissions.map(p => p.id);
        const missingIds = dto.permissionIds.filter(id => !foundIds.includes(id));
        throw new NotFoundException(
          `Разрешения с ID ${missingIds.join(', ')} не найдены`
        );
      }

      // 4. Фильтруем новые permissions
      const currentPermissionIds = new Set(role.permissions.map(p => p.id));
      const newPermissions = permissions.filter(
        p => !currentPermissionIds.has(p.id)
      );

      if (newPermissions.length === 0) {
        throw new BadRequestException('Все указанные права уже есть у роли');
      }

      // 5. Обновляем и сохраняем
      role.permissions = [...role.permissions, ...newPermissions];

      const updatedRole = await queryRunner.manager.save(role);
      if (updatedRole === undefined) {
        throw new NotFoundException('Что то пошло не так')
      }
      await queryRunner.commitTransaction();
      return updatedRole;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}
