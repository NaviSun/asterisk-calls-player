import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('adidofiles')
export class AudioFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filePath: string;

  @Column()
  inColNumber: string;

  @Column()
  OutColNumber: string;

  @Column({unique: true})
  fileName: string;

  @Column()
  createdAt: Date;
}