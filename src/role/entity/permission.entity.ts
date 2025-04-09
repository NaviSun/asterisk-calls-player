import { PrimaryGeneratedColumn, Column, ManyToMany, Entity } from "typeorm";
import { RoleEntity } from "./role.entity";

@Entity('permissions')
export class PermissionEntity {
     @PrimaryGeneratedColumn()
      id: number;
    
      @Column({unique: true})
      permission: string;

      @ManyToMany(type => RoleEntity, (role) => role.permissions)
      roles: RoleEntity[];
}
