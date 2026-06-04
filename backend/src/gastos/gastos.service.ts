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

  async create(createGastoDto: CreateGastoDto): Promise<Gasto> {
    return this.gastoModel.create(createGastoDto);
  }

  async findAll(): Promise<Gasto[]> {
    return this.gastoModel.find().sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Gasto> {
    const gasto = await this.gastoModel.findById(id).exec();

    if (!gasto) {
      throw new NotFoundException('Gasto não encontrado');
    }

    return gasto;
  }

  async update(id: string, updateGastoDto: UpdateGastoDto): Promise<Gasto> {
    const gasto = await this.gastoModel
      .findByIdAndUpdate(id, updateGastoDto, { new: true })
      .exec();

    if (!gasto) {
      throw new NotFoundException('Gasto não encontrado');
    }

    return gasto;
  }

  async remove(id: string): Promise<void> {
    const gasto = await this.gastoModel.findByIdAndDelete(id).exec();

    if (!gasto) {
      throw new NotFoundException('Gasto não encontrado');
    }
  }
}