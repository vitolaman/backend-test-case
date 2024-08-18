import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonModule, utilities as WinstonNestUtilities } from 'nest-winston';
import * as Winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: WinstonModule.createLogger({
      transports: [
        new Winston.transports.Console({
          format: Winston.format.combine(
            Winston.format.timestamp(),
            Winston.format.ms(),
            WinstonNestUtilities.format.nestLike('API', {
              colors: true,
              prettyPrint: false,
            }),
          ),
        }),
      ],
    }),
  });

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Eigen Test Case')
      .setDescription(
        ['Vito Varian Laman', 'https://github.com/vitolaman/'].join('<br>'),
      )
      .setVersion('1.0')
      .build(),
  );

  SwaggerModule.setup('api', app, document);
  await app.listen(3000, () => {
    console.log('[REST]', `http://localhost:3000/api`);
  });
}
bootstrap();
