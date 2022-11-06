import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ImDbModule } from './imdb.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    ImDbModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
}
bootstrap();
