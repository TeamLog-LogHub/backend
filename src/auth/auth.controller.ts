import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccessGuard } from './guards/access.guard';
import { Request, Response } from 'express';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RefreshGuard } from './guards/refresh.guard';
import { GoogleGuard } from './guards/google.guard';
import { HttpExceptionRedirectFilter } from 'src/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  check(@Req() req: Request) {
    return req.user;
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  async refresh(@Req() req: Request) {
    if (!req.user)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    return {
      access_token: await this.authService.generateAccessToken(req.user),
    };
  }

  @Get('logout')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['Refresh'];

    if (!refreshToken)
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);

    await this.authService.removeRefreshToken(refreshToken);

    res.clearCookie('Refresh');
    res.status(HttpStatus.OK).send('ok');
  }

  @Get('/google')
  @UseGuards(GoogleGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleAuth() {}

  @Get('/google/callback')
  @UseGuards(GoogleGuard)
  @UseFilters(new HttpExceptionRedirectFilter('/auth/google', [401]))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const refreshToken = await this.authService.generateRefreshToken(
      req.user.email,
    );
    const frontendUrl = this.config.get<string>('FRONTEND_URL');

    res.cookie('Refresh', refreshToken, {
      httpOnly: true,
      secure: this.config.get<string>('NODE_ENV') === 'production',
      maxAge: this.config.get<number>('REFRESH_TOKEN_EXPIRES_IN'),
    });
    res.redirect(`${frontendUrl}`);
  }
}
