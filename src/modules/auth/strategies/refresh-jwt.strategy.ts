import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import * as argon2 from 'argon2';
import { FarmersService } from 'src/modules/farmers/farmers.service';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private readonly users: FarmersService) {
    super({
      jwtFromRequest: (req: Request) => {
        // Prefer HttpOnly cookie 'rt'; fallback to Bearer
        const cookie = req?.cookies?.rt;
        if (cookie) return cookie;
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      secretOrKey: process.env.REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    const token =
      req?.cookies?.rt || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) throw new UnauthorizedException();

    const user = await this.users.findById(payload.sub);
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException();

    const valid = await argon2.verify(user.refreshTokenHash, token);
    if (!valid) throw new UnauthorizedException();

    // attach minimal info + signal that we validated the token itself
    return { sub: user.id, email: user.email };
  }
}
