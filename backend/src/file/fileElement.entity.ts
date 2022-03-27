import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class FileElement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  filename: string;

  @Column()
  originalFileName: string;

  @Column()
  size: number

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdAt: string;

  @ManyToOne(() => User, (user) => user.files, {
    nullable: true
  })
  user: User

  @Column()
  userId: number;
}
