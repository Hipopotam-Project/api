import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import express from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { GetCurrentUserId } from './decorators/get-current-user-id.decorator';

function setRefreshCookie(res: express.Response, token: string) {
  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7d
  res.cookie('rt', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/auth/refresh', // only sent to refresh endpoint
    maxAge,
    secure: process.env.NODE_ENV === 'production',
  });
}

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { user, tokens } = await this.auth.register(
      dto.email,
      dto.password,
      dto.phone,
      dto.name,
      dto.farm_join_code,
    );
    setRefreshCookie(res, tokens.refreshToken);
    return { user, accessToken: tokens.accessToken };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { user, tokens } = await this.auth.login(dto.email, dto.password);
    setRefreshCookie(res, tokens.refreshToken);
    return { user, accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    await this.auth.logout(userId);
    res.clearCookie('rt', { path: '/auth/refresh' });
    return { success: true };
  }

  @UseGuards(RefreshJwtGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @GetCurrentUserId() userId: string,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const tokens = await this.auth.refreshTokens(userId);
    setRefreshCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }
}
