import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '60m',
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
