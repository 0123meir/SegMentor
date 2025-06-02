import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { ConfigModule } from '@nestjs/config';
import { VideoInitializerController } from './video-initializer.controllers';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UsersController, VideoInitializerController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/users/login', '/users')
      .forRoutes('*');
  }
}
