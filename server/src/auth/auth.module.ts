import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ModelsModule } from 'src/models/models.module';
import { AuthService } from './auth.service';
import { jwtConstants } from '../constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ModelsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
