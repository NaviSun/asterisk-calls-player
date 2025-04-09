import { PrimaryGeneratedColumn, Column, Entity, BeforeUpdate, JoinTable, ManyToMany } from "typeorm";
import { RoleEntity } from "./../../role/entity/role.entity";

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: '' })
  avatar: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column({ default: true })
  banned: boolean;

  @Column({ default: '' })
  banReason: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable()
  roles: RoleEntity[];
}