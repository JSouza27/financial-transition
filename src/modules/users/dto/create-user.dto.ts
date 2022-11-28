import { Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @MinLength(3, {
    message: 'Nome de usuário não deve ser inferior a 3 caracteres.',
  })
  username: string;

  @MinLength(8, {
    message: 'A senha deve ter pelo menos 8 caracteres.',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])/g, {
    message: 'A senha ser composta por letra maiúscula, minúscula e numeros.',
  })
  password: string;
}
