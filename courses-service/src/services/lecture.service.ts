import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lecture } from '../schemas/lecture.schema';
import { CreateLectureDto, UpdateLectureDto } from '../dto/lecture.dto';

@Injectable()
export class LectureService {
  constructor(
    @InjectModel(Lecture.name) private lectureModel: Model<Lecture>,
  ) {}

  async create(createLectureDto: CreateLectureDto): Promise<Lecture> {
    const createdLecture = new this.lectureModel(createLectureDto);
    return createdLecture.save();
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
    return this.lectureModel.findByIdAndDelete(id).exec();
  }
}
