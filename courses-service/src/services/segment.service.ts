import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lecture } from '../schemas/lecture.schema';
import { SegmentDto } from '../dto/segment.dto';

@Injectable()
export class SegmentService {
  constructor(
    @InjectModel(Lecture.name) private lectureModel: Model<Lecture>,
  ) {}

  async findAll(lectureId: string) {
    const lecture = await this.lectureModel.findById(lectureId).exec();
    if (!lecture) throw new NotFoundException('Lecture not found');
    return lecture.segments;
  }

  async create(lectureId: string, dto: SegmentDto) {
    const lecture = await this.lectureModel.findById(lectureId).exec();
    if (!lecture) throw new NotFoundException('Lecture not found');
    if (lecture.segments.some((s) => s.title === dto.title)) {
      throw new ConflictException('Segment with this title already exists');
    }
    lecture.segments.push(dto);
    await lecture.save();
    return dto;
  }

  async update(lectureId: string, segmentTitle: string, dto: SegmentDto) {
    const lecture = await this.lectureModel.findById(lectureId).exec();
    if (!lecture) throw new NotFoundException('Lecture not found');
    const segment = lecture.segments.find((s) => s.title === segmentTitle);
    if (!segment) throw new NotFoundException('Segment not found');
    Object.assign(segment, dto);
    await lecture.save();
    return segment;
  }

  async remove(lectureId: string, segmentTitle: string) {
    const lecture = await this.lectureModel.findById(lectureId).exec();
    if (!lecture) throw new NotFoundException('Lecture not found');
    const index = lecture.segments.findIndex((s) => s.title === segmentTitle);
    if (index === -1) throw new NotFoundException('Segment not found');
    lecture.segments.splice(index, 1);
    await lecture.save();
    return { deleted: true };
  }
}
