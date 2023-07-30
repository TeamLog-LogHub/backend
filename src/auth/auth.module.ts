import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from './strategies/access.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessStrategy, RefreshStrategy],
})
export class AuthModule {}
