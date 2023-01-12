import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { privateKey } from './constants';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      privateKey,
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '60m',
      },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
