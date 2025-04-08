import { PrimaryGeneratedColumn, Column, Entity, BeforeUpdate } from "typeorm";
import { UserRole } from "../enums/user-role.enum";
import { Premission, PremissionType } from "./../../auth/premission.type";


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

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({enum: Premission, default: [], type: 'json'})
  premissions: PremissionType[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}