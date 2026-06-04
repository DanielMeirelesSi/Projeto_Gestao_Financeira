import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MetaDocument = HydratedDocument<Meta>;

@Schema({ timestamps: true })
export class Meta {
  @Prop({ required: true, trim: true })
  nome!: string;

  @Prop({ required: true, min: 0 })
  valorObjetivo!: number;

  @Prop({ required: true, min: 0, default: 0 })
  valorAtual!: number;

  @Prop({ required: true })
  dataLimite!: string;

  @Prop({ required: true })
  usuarioId!: string;
}

export const MetaSchema = SchemaFactory.createForClass(Meta);