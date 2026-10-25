import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TokenService } from './token/token.service';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../config/envs';

@Module({
  imports:[
    UsersModule,
    JwtModule.register({
      secret: envs.JWT_SECRET,
      signOptions:{
        expiresIn: 86400
      }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService],
  exports: [TokenService]
})
export class AuthModule {}
