import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import { json, urlencoded } from "express";
import { AppModule } from "./app.module";
import * as compression from "compression";
import * as helmet from "helmet";
import { useContainer } from "class-validator";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get("PORT");
  app.use(json({ limit: "10MB" }));
  app.use(compression());
  app.use(urlencoded({ extended: true, limit: "10MB" }));
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));
  const config = new DocumentBuilder().setTitle("TAS").addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "jwt").setVersion("1.0").addTag("studentApp").build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // await app.listen(3000);
  await app.listen(port);
}
bootstrap();
