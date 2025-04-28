import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { HttpModule } from '@nestjs/axios';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { CoursesProxyMiddleware } from './apiProxies/courses-proxy.middleware';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware, CoursesProxyMiddleware)
      .forRoutes({ path: 'courses*', method: RequestMethod.ALL });
  }
}
