import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { Tokens } from './types/tokens.types';
import { FarmersService } from '../farmers/farmers.service';
import { FarmService } from '../farm/farm.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: FarmersService,
    private readonly jwt: JwtService,
    private readonly farmService: FarmService,
  ) {}

  private async signTokens(userId: string, email: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(
        { sub: userId, email },
        {
          secret: process.env.ACCESS_TOKEN_SECRET,
          expiresIn: process.env.ACCESS_TOKEN_TTL ?? '15m',
        },
      ),
      this.jwt.signAsync(
        { sub: userId, email },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: process.env.REFRESH_TOKEN_TTL ?? '7d',
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }

  async handleFarmerRelation(uId: string, joinCode: string) {
    const joinFarm = await this.farmService.getJoinFarmByCode(Number(joinCode));
    if (!joinFarm) {
      throw new ForbiddenException('Invalid farm join code');
    }
    // await this.users.setFarm(uId, joinFarm.farm_id, joinFarm.isAdmin);
    await this.farmService.deleteJoinFarmByKey(joinFarm.key);
    return joinFarm.farm_id;
  }

  async register(
    email: string,
    password: string,
    phone: string,
    name: string,
    joinCode: string,
  ) {
    const hash = await argon2.hash(password);
    const farmId = await this.handleFarmerRelation(email, joinCode);
    console.log('farmId', farmId);
    const user = await this.users.create(email, hash, phone, name, farmId);
    const tokens = await this.signTokens(user.id, user.email);
    const rtHash = await argon2.hash(tokens.refreshToken);
    await this.users.setRefreshTokenHash(user.id, rtHash);
    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        joinCode,
      },
      tokens,
    };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.signTokens(user.id, user.email);
    const rtHash = await argon2.hash(tokens.refreshToken);
    await this.users.setRefreshTokenHash(user.id, rtHash);
    return {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      tokens,
    };
  }

  async logout(userId: string) {
    await this.users.clearRefreshToken(userId);
    return { success: true };
  }

  // auth.service.ts
  async refreshTokens(userId: string) {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException();
    const tokens = await this.signTokens(user.id, user.email);
    const rtHash = await argon2.hash(tokens.refreshToken);
    await this.users.setRefreshTokenHash(user.id, rtHash);
    return tokens;
  }
}
