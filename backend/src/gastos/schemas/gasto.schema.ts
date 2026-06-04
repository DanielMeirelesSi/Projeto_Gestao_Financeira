import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GastoDocument = HydratedDocument<Gasto>;

@Schema({ timestamps: true })
export class Gasto {
  @Prop({ required: true, trim: true })
  descricao!: string;

  @Prop({ required: true, trim: true })
  categoria!: string;

  @Prop({
    required: true,
    enum: ['Fixo', 'Variável', 'Obrigatório'],
  })
  tipo!: 'Fixo' | 'Variável' | 'Obrigatório';

  @Prop({ required: true, min: 0 })
  valor!: number;

  @Prop({ required: true })
  data!: string;

  @Prop({ required: true })
  usuarioId!: string;
}

export const GastoSchema = SchemaFactory.createForClass(Gasto);