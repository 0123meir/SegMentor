import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lecture } from '../schemas/lecture.schema';
import { CreateLectureDto, UpdateLectureDto } from '../dto/lecture.dto';
import { Course } from 'src/schemas/course.schema';
import { WatchedLecture } from 'src/schemas/watched-lecture.schema';

@Injectable()
export class LectureService {
  constructor(
    @InjectModel(Lecture.name) private lectureModel: Model<Lecture>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(WatchedLecture.name)
    private watchedLectureModel: Model<WatchedLecture>,
  ) {}

  async create(
    createLectureDto: CreateLectureDto & { courseId: string },
  ): Promise<Lecture> {
    // Create and save the lecture to get a proper Mongoose document
    const lecture = new this.lectureModel(createLectureDto);
    const createdLecture = await lecture.save();

    // Add the lectureId to the course
    const course = await this.courseModel.findById(createLectureDto.courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    course.lectures.push(createdLecture._id as unknown as Types.ObjectId);
    await course.save();

    return createdLecture;
  }

  async findAll(): Promise<Lecture[]> {
    return this.lectureModel.find().exec();
  }

  async findOne(id: string): Promise<Lecture> {
    return this.lectureModel.findById(id).exec();
  }

  async update(
    id: string,
    updateLectureDto: UpdateLectureDto,
  ): Promise<Lecture> {
    return this.lectureModel
      .findByIdAndUpdate(id, updateLectureDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Lecture> {
    // remove the lecture from the course
    const course = await this.courseModel.findOne({
      lectures: id,
    });

    if (course) {
      course.lectures = course.lectures.filter(
        (lectureId) => lectureId.toString() !== id,
      );
      await course.save();

      // remove the lecture
      const lecture = await this.lectureModel.findById(id);
      if (!lecture) {
        throw new Error('Lecture not found');
      }
      // remove the lecture from the watched lectures
      const watchedLecture = await this.watchedLectureModel.findOne({
        lectureId: id,
      });
      if (watchedLecture) {
        await this.watchedLectureModel.deleteMany({
          lectureId: id,
        });
      }

      return this.lectureModel.findByIdAndDelete(id).exec();
    }
  }
}
