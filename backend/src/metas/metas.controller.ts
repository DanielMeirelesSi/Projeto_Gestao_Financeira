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
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { MetasService } from './metas.service';

type JwtPayload = {
  sub: string;
  usuario: string;
  admin: boolean;
};

type AuthenticatedRequest = Request & {
  usuario: JwtPayload;
};

@Controller('metas')
@UseGuards(AuthGuard)
export class MetasController {
  constructor(private readonly metasService: MetasService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createMetaDto: CreateMetaDto,
  ) {
    return this.metasService.create(request.usuario.sub, createMetaDto);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.metasService.findAll(request.usuario.sub);
  }

  @Get(':id')
  findOne(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.metasService.findOne(id, request.usuario.sub);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateMetaDto: UpdateMetaDto,
  ) {
    return this.metasService.update(
      id,
      request.usuario.sub,
      updateMetaDto,
    );
  }

  @Delete(':id')
  remove(
    @Req() request: AuthenticatedRequest,
    @Param('id', ParseObjectIdPipe) id: string,
  ) {
    return this.metasService.remove(id, request.usuario.sub);
  }
}