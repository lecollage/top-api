import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(
    dto: Omit<TopPageModel, '_id'>,
  ): Promise<DocumentType<TopPageModel>> {
    return this.topPageModel.create(dto);
  }

  async findById(id: string): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    dto: Omit<TopPageModel, '_id'>,
  ): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async find(dto: FindTopPageDto): Promise<TopPageModel[]> {
    return this.topPageModel
      .aggregate([
        {
          $match: {
            firstCategory: dto.firstCategory,
          },
        },
      ])
      .exec();
  }
}
