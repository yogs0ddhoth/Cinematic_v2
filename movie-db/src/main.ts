import { NestFactory } from '@nestjs/core';
import { MovieDbModule } from './movie-db.module';

async function bootstrap() {
  const PORT = 4002;
  const app = await NestFactory.create(MovieDbModule);

  await app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
}
bootstrap();
