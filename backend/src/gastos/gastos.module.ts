import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { GastosController } from './gastos.controller';
import { GastosService } from './gastos.service';
import { Gasto, GastoSchema } from './schemas/gasto.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Gasto.name,
        schema: GastoSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [GastosController],
  providers: [GastosService],
})
export class GastosModule {}