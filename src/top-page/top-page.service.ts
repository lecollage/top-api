import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';

import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto): Promise<DocumentType<TopPageModel>> {
    return this.topPageModel.create(dto);
  }

  async deleteById(id: string): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(
    id: string,
    dto: CreateTopPageDto,
  ): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findById(id: string): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string): Promise<DocumentType<TopPageModel> | null> {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async find(dto: FindTopPageDto): Promise<TopPageModel[]> {
    return this.topPageModel
      .find(
        { firstCategory: dto.firstCategory },
        { alias: 1, secondCategory: 1, title: 1 },
      )
      .exec();
  }

  async findByText(text: string): Promise<TopPageModel[]> {
    return this.topPageModel
      .find({ $text: { $search: text, $caseSensitive: false } })
      .exec();
  }
}
