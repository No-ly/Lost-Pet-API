import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PENDING_EMAIL')
export class PendingEmail {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  payload!: string;

  @Column({ default: true })
  isPending!: boolean;

  @Column()
  subject!: string;

  @Column()
  to!: string;
}