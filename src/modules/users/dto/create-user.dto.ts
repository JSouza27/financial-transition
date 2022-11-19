import { Matches, Min } from 'class-validator';

export class CreateUserDto {
  @Min(3, {
    message: 'Nome de usuário não deve ser inferior a 3 caracteres.',
  })
  username: string;

  @Min(8, {
    message: 'A senha deve ter pelo menos 8 caracteres.',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])/g, {
    message: 'A senha ser composta por letra maiúscula, minúscula e numeros.',
  })
  password: string;
}
