import { PrimaryGeneratedColumn, Column, ManyToMany, Entity, JoinTable } from "typeorm";
import { PermissionEntity } from "./permission.entity";
import { UserEntity } from "./../../users/entities/user.entity";

@Entity('roles')
export class RoleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    role: string;

    
    @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
    @JoinTable()
    permissions: PermissionEntity[];
    
    @ManyToMany(() => UserEntity, (user) => user.roles)
    users: UserEntity[];
}
