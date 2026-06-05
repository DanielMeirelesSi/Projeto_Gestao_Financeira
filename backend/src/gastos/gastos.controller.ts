import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { GastosService } from './gastos.service';

type JwtPayload = {
  sub: string;
  usuario: string;
  admin: boolean;
};

type AuthenticatedRequest = Request & {
  usuario: JwtPayload;
};

@Controller('gastos')
@UseGuards(AuthGuard)
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createGastoDto: CreateGastoDto,
  ) {
    return this.gastosService.create(request.usuario.sub, createGastoDto);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.gastosService.findAll(request.usuario.sub);
  }

  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.gastosService.findOne(id, request.usuario.sub);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateGastoDto: UpdateGastoDto,
  ) {
    return this.gastosService.update(
      id,
      request.usuario.sub,
      updateGastoDto,
    );
  }

  @Delete(':id')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.gastosService.remove(id, request.usuario.sub);
  }
}