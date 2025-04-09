import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entity/role.entity';
import { PermissionEntity } from './entity/permission.entity';
import { RoleService } from './role.service';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity])],
    providers: [RoleService],
})
export class RoleModule {}
