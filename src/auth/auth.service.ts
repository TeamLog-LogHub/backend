import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async generateAccessToken(user: Express.User) {
    return await this.jwtService.signAsync(user, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION_TIME'),
    });
  }

  public async generateRefreshToken(email: string) {
    const token = await this.jwtService.signAsync(
      { email },
      {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION_TIME',
        ),
      },
    );

    await this.cacheManager.set(
      `refresh-${email}`,
      token,
      ms(this.configService.get<string>('JWT_REFRESH_EXPIRATION_TIME')),
    );
    return token;
  }

  public async removeRefreshToken(refreshToken: string) {
    const token = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });

    this.cacheManager.del(`refresh-${token.email}`);
  }

  public async validateRefreshToken(email: string, refreshToken: string) {
    try {
      const token = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });

      return (
        token.email === email &&
        (await this.cacheManager.get(refreshToken)) === refreshToken
      );
    } catch {
      return false;
    }
  }
}
