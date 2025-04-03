import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity('users')
export class UserEntity {
      @PrimaryGeneratedColumn()
      id: number;
      
      @Column(require)
      firstName: string;

      @Column(require)
      lastName: string;

      @Column({default: null})
      avatar: string;

      @Column({unique: true, })
      email: string;
    
      @Column()
      passwordHash: string;
    
      @Column({default: true})
      banned: boolean;
    
      @Column({unique: true, default: 'Need Access from Admin'})
      banReason: string;

      @Column({default: 'user'})
      role: string;
    
      @Column()
      createdAt: Date;

      @Column()
      updatedAt: Date;
}
