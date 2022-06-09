import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose/lib/types';

import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TOP_PAGE_IS_NOT_FOUND } from './top-page.constants';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() dto: CreateTopPageDto,
  ): Promise<DocumentType<TopPageModel>> {
    return this.topPageService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async get(
    @Param('id', IdValidationPipe) id: string,
  ): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageService.findById(id);
  }

  @Get('byAlias/:alias')
  async getByAlias(
    @Param('alias') alias: string,
  ): Promise<DocumentType<TopPageModel> | null> {
    const page = await this.topPageService.findByAlias(alias);

    if (!page) {
      throw new NotFoundException(TOP_PAGE_IS_NOT_FOUND);
    }

    return page;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string): Promise<void> {
    const deletedDoc = await this.topPageService.deleteById(id);

    if (!deletedDoc) {
      throw new HttpException(TOP_PAGE_IS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async patch(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ): Promise<DocumentType<TopPageModel> | null> {
    const updatedDoc = await this.topPageService.updateById(id, dto);

    if (!updatedDoc) {
      throw new HttpException(TOP_PAGE_IS_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return updatedDoc;
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto): Promise<TopPageModel[]> {
    return this.topPageService.find(dto);
  }

  @Get('text-search/:text')
  async textSearch(@Param('text') text: string): Promise<TopPageModel[]> {
    return this.topPageService.findByText(text);
  }
}
