import { PrismaClient, Token } from '@prisma/client';

export class TokenService {
  constructor(private readonly prismaToken: PrismaClient['token']) {}

  async findRefreshToken(token: string): Promise<Token | null> {
    return this.prismaToken.findFirst({
      where: { token, type: TokenType.REFRESH },
    });
  }

  async saveRefreshToken(userId: number, token: string): Promise<Token> {
    let model = await this.prismaToken.findFirst({
      where: { userId, type: TokenType.REFRESH },
    });

    if (model) {
      model = await this.prismaToken.update({
        where: { id: model.id },
        data: { token },
      });
    } else {
      model = await this.prismaToken.create({
        data: { userId, token, type: TokenType.REFRESH },
      });
    }

    return model;
  }

  async removeRefreshToken(token: string): Promise<boolean> {
    const result = await this.prismaToken.deleteMany({
      where: { token, type: TokenType.REFRESH },
    });

    return result.count > 0;
  }
}

export enum TokenType {
  REFRESH = 'refreshToken',
}
