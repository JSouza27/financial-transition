import { Account } from '../../accounts/entities/account.entity';

export class UserResponseDto {
  id: string;
  username: string;
  account: Account;
}
