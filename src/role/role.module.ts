import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './entity/role.entity';
import { PermissionEntity } from './entity/permission.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
    imports: [TypeOrmModule.forFeature([RoleEntity, PermissionEntity])],
    providers: [RoleService],
    controllers: [RoleController],
    exports: [RoleService]
})
export class RoleModule {}
