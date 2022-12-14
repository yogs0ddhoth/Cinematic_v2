import { NestFactory } from '@nestjs/core';
import { UserAuthModule } from './user-auth.module';

async function bootstrap() {
  const PORT = 4001;
  const app = await NestFactory.create(UserAuthModule);

  await app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
}
bootstrap();
