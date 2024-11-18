import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('profile_user')
export class ProfileUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;
}
