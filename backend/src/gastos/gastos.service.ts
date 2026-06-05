import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { Gasto, GastoDocument } from './schemas/gasto.schema';

@Injectable()
export class GastosService {
  constructor(
    @InjectModel(Gasto.name)
    private readonly gastoModel: Model<GastoDocument>,
  ) {}

  async create(
    usuarioId: string,
    createGastoDto: CreateGastoDto,
  ): Promise<Gasto> {
    return this.gastoModel.create({
      ...createGastoDto,
      usuarioId,
    });
  }

  async findAll(usuarioId: string): Promise<Gasto[]> {
    return this.gastoModel
      .find({ usuarioId })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, usuarioId: string): Promise<Gasto> {
    const gasto = await this.gastoModel
      .findOne({
        _id: id,
        usuarioId,
      })
      .exec();

    if (!gasto) {
      throw new NotFoundException('Gasto não encontrado');
    }

    return gasto;
  }

  async update(
    id: string,
    usuarioId: string,
    updateGastoDto: UpdateGastoDto,
  ): Promise<Gasto> {
    const gasto = await this.gastoModel
      .findOneAndUpdate(
        {
          _id: id,
          usuarioId,
        },
        updateGastoDto,
        {
          new: true,
          runValidators: true,
        },
      )
      .exec();

    if (!gasto) {
      throw new NotFoundException('Gasto não encontrado');
    }

    return gasto;
  }

  async remove(id: string, usuarioId: string): Promise<void> {
    const gasto = await this.gastoModel
      .findOneAndDelete({
        _id: id,
        usuarioId,
      })
      .exec();

    if (!gasto) {
      throw new NotFoundException('Gasto não encontrado');
    }
  }
}