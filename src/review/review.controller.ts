import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose/lib/types';

import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewModel } from './review.model';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { TelegramService } from '../telegram/telegram.service';

@Controller('review')
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly telegramService: TelegramService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(
    @Body() dto: CreateReviewDto,
  ): Promise<DocumentType<ReviewModel>> {
    return this.reviewService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('notify')
  async notify(@Body() dto: CreateReviewDto): Promise<void> {
    const message =
      `Имя: ${dto.name}\n` +
      `Заголовок: ${dto.title}\n` +
      `Описание: ${dto.description}\n` +
      `Рейтинг: ${dto.rating}\n` +
      `ID продукта: ${dto.productId}\n`;

    await this.telegramService.sendMessage(message);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @UserEmail() email: string,
  ): Promise<void> {
    const deletedDoc = await this.reviewService.delete(id);

    if (!deletedDoc) {
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }

  @Get('byProduct/:productId')
  async getByProduct(
    @Param('productId') productId: string,
  ): Promise<DocumentType<ReviewModel>[]> {
    return this.reviewService.findByProductId(productId);
  }

  @Get('getAllProducts')
  async getAll() {
    return this.reviewService.getAllProducts();
  }
}
