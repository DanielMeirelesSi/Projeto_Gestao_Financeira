import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { Meta, MetaDocument } from './schemas/meta.schema';

@Injectable()
export class MetasService {
  constructor(
    @InjectModel(Meta.name)
    private readonly metaModel: Model<MetaDocument>,
  ) {}

  async create(createMetaDto: CreateMetaDto): Promise<Meta> {
    return this.metaModel.create(createMetaDto);
  }

  async findAll(): Promise<Meta[]> {
    return this.metaModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Meta> {
    const meta = await this.metaModel.findById(id).exec();

    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }

    return meta;
  }

  async update(id: string, updateMetaDto: UpdateMetaDto): Promise<Meta> {
    const meta = await this.metaModel
      .findByIdAndUpdate(id, updateMetaDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }

    return meta;
  }

  async remove(id: string): Promise<void> {
    const meta = await this.metaModel.findByIdAndDelete(id).exec();

    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }
  }
}