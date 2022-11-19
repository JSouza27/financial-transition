import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'varchar', length: 50 })
  username: string;

  @Column({ nullable: false })
  password: string;

  @OneToOne(() => Account, (account) => account.user)
  @JoinColumn({ name: 'account_id' })
  accountId: Account;
}
