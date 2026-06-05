import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MetasController } from './metas.controller';
import { MetasService } from './metas.service';
import { Meta, MetaSchema } from './schemas/meta.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Meta.name,
        schema: MetaSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [MetasController],
  providers: [MetasService],
})
export class MetasModule {}