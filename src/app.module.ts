import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigValidator } from './validator/config.validator';
import { UserModule } from './user/user.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ConfigValidator,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    NoticeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
