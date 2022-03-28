import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { FileElement } from '../file/fileElement.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  refreshToken: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => FileElement, (FileElement) => FileElement.user, {
    cascade: true,
  })
  files: FileElement[];
}
