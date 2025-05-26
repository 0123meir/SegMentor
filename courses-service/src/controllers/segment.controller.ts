import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { SegmentService } from '../services/segment.service';
import { SegmentDto } from '../dto/segment.dto';

@Controller('segments')
export class SegmentController {
  constructor(private readonly segmentService: SegmentService) {}

  @Get(':lectureId')
  findAll(@Param('lectureId') lectureId: string) {
    return this.segmentService.findAll(lectureId);
  }

  @Post(':lectureId')
  create(@Param('lectureId') lectureId: string, @Body() dto: SegmentDto) {
    return this.segmentService.create(lectureId, dto);
  }

  @Patch(':lectureId/:segmentTitle')
  update(
    @Param('lectureId') lectureId: string,
    @Param('segmentTitle') segmentTitle: string,
    @Body() dto: SegmentDto,
  ) {
    return this.segmentService.update(lectureId, segmentTitle, dto);
  }

  @Delete(':lectureId/:segmentTitle')
  remove(
    @Param('lectureId') lectureId: string,
    @Param('segmentTitle') segmentTitle: string,
  ) {
    return this.segmentService.remove(lectureId, segmentTitle);
  }
}
