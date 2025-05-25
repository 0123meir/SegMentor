import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseModule } from './modules/course.module';
import { WatchedLectureModule } from './modules/watched-lecture.module';
import { LectureModule } from './modules/lecture.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    CourseModule,
    WatchedLectureModule,
    LectureModule,
  ],
  providers: [Logger],
})
export class AppModule {}
