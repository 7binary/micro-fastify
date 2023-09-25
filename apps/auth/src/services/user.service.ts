import { PrismaClient, User } from '@prisma/client';
import { ValidationError } from 'fastify-common';

import { LoginDtoType } from '@/dto/login.dto';
import { RegisterDtoType } from '@/dto/register.dto';
import { HashService } from './hash.service';

export class UserService {
  constructor(private readonly prismaUser: PrismaClient['user']) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prismaUser.findUnique({
      where: { email },
    });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.prismaUser.findUnique({
      where: { id },
    });
  }

  toJson(user: User) {
    return exclude(user, ['passwordHash', 'passwordSalt', 'updatedAt']);
  }

  async login(dto: LoginDtoType): Promise<User> {
    const user = await this.findOneByEmail(dto.email);
    const invalidError = 'Invalid email or password';

    if (!user || !user.passwordSalt || !user.passwordHash) {
      throw new ValidationError(invalidError);
    }

    const { passhash } = await HashService.generatePasshash(dto.password, user.passwordSalt);
    if (passhash !== user.passwordHash) {
      throw new ValidationError(invalidError);
    }

    return user;
  }

  async register(dto: RegisterDtoType): Promise<User> {
    const { email, password } = dto;
    const userByEmail = await this.findOneByEmail(email);

    if (userByEmail) {
      throw new ValidationError('E-mail is already registered');
    }

    const { salt, passhash } = await HashService.generatePasshash(password);
    const user = await this.prismaUser.create({
      data: {
        email: dto.email,
        passwordSalt: salt,
        passwordHash: passhash,
      },
    });

    return user;
  }
}

function exclude<User, Key extends keyof User>(model: User, keys: Key[]): Omit<User, Key> {
  for (const key of keys) {
    delete model[key];
  }

  return model;
}
