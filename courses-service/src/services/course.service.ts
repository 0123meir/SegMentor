import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../schemas/course.schema';
import { WatchedLecture } from '../schemas/watched-lecture.schema';
import { CreateCourseDto, UpdateCourseDto } from '../dto/course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(WatchedLecture.name)
    private watchedLectureModel: Model<WatchedLecture>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const createdCourse = new this.courseModel(createCourseDto);
    return createdCourse.save();
  }

  async findAll(): Promise<Course[]> {
    return this.courseModel
      .find()
      .populate('lectures')
      .populate('lecturer')
      .exec();
  }

  async findOne(id: string): Promise<Course> {
    return this.courseModel
      .findById(id)
      .populate('lectures')
      .populate('lecturer')
      .exec();
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    return this.courseModel
      .findByIdAndUpdate(id, updateCourseDto, { new: true })
      .populate('lectures')
      .populate('lecturer')
      .exec();
  }

  async remove(id: string): Promise<Course> {
    return this.courseModel.findByIdAndDelete(id).exec();
  }

  async findAllWithWatchedLectures(userId: string) {
    // Populate lectures and lecturer fields
    const courses = await this.courseModel
      .find()
      .populate('lectures')
      .populate('lecturer')
      .lean();

    // Get all watched lectures for this user
    const watched = await this.watchedLectureModel.find({ userId }).lean();

    // Group watched lectures by courseId
    const watchedByCourse: Record<string, string[]> = {};
    watched.forEach((watchedLecture) => {
      const courseId = watchedLecture.courseId.toString();
      if (!watchedByCourse[courseId]) watchedByCourse[courseId] = [];
      watchedByCourse[courseId].push(watchedLecture.lectureId.toString());
    });

    // Attach watchedLectures to each course
    return courses.map((course) => ({
      ...course,
      watchedLectures: watchedByCourse[course._id.toString()] || [],
    }));
  }
}
