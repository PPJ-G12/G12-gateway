import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { envs } from "./config";
import { Logger, ValidationPipe } from "@nestjs/common";
import { RpcCustomExceptionFilter } from "./common";

async function bootstrap() {
  const logger = new Logger("Main-Gateway");

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());
  app.enableCors({
    origin: "http://localhost:4200", // Cambia esto al dominio de tu frontend en producción
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true, // Habilita cookies y autenticación en las solicitudes si es necesario
  });

  await app.listen(envs.port);

  logger.log(`Gateway running on port ${envs.port}`);
}

bootstrap();
