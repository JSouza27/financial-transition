import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Account } from '../../accounts/entities/account.entity';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('double precision')
  value: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Account)
  debitedAccountId: Account;

  @ManyToOne(() => Account)
  creditedAccountId: Account;
}
