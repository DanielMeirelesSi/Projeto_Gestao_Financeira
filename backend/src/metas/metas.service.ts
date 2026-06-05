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

  async create(
    usuarioId: string,
    createMetaDto: CreateMetaDto,
  ): Promise<Meta> {
    return this.metaModel.create({
      ...createMetaDto,
      usuarioId,
    });
  }

  async findAll(usuarioId: string): Promise<Meta[]> {
    return this.metaModel
      .find({ usuarioId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, usuarioId: string): Promise<Meta> {
    const meta = await this.metaModel
      .findOne({
        _id: id,
        usuarioId,
      })
      .exec();

    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }

    return meta;
  }

  async update(
    id: string,
    usuarioId: string,
    updateMetaDto: UpdateMetaDto,
  ): Promise<Meta> {
    const meta = await this.metaModel
      .findOneAndUpdate(
        {
          _id: id,
          usuarioId,
        },
        updateMetaDto,
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }

    return meta;
  }

  async remove(id: string, usuarioId: string): Promise<void> {
    const meta = await this.metaModel
      .findOneAndDelete({
        _id: id,
        usuarioId,
      })
      .exec();

    if (!meta) {
      throw new NotFoundException('Meta não encontrada');
    }
  }
}