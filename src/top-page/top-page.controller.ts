import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose/lib/types';

import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TOP_PAGE_IS_NOT_FOUND } from './top-page.constants';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @Post('create')
  async create(
    @Body() dto: Omit<TopPageModel, '_id'>,
  ): Promise<DocumentType<TopPageModel>> {
    return this.topPageService.create(dto);
  }

  @Get(':id')
  async get(
    @Param('id', IdValidationPipe) id: string,
  ): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string): Promise<void> {
    const deletedDoc = await this.topPageService.deleteById(id);

    if (!deletedDoc) {
      throw new HttpException(TOP_PAGE_IS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: Omit<TopPageModel, '_id'>,
  ): Promise<DocumentType<TopPageModel> | null> {
    const updatedDoc = await this.topPageService.updateById(id, dto);

    if (!updatedDoc) {
      throw new HttpException(TOP_PAGE_IS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return updatedDoc;
  }

  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto): Promise<TopPageModel[]> {
    return this.topPageService.find(dto);
  }
}
