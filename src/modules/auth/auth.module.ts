import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FarmersModule } from '../farmers/farmers.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessJwtStrategy } from './strategies/access-jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { FarmModule } from '../farm/farm.module';

@Module({
  imports: [
    FarmersModule,
    FarmModule,
    JwtModule.register({}), // secrets provided ad-hoc in service
  ],
  providers: [AuthService, AccessJwtStrategy, RefreshJwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
