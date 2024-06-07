import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { PautasService } from './pautas.service';
import {
  CriarPautaResource,
  NewSessionResource,
  toDomain,
  toRepresentation,
} from './pautas.resource';
import { Response } from 'express';
import { Pauta } from './pauta.entity';
import { ErrorResponse } from 'src/common/error.resource';

@Controller('pautas')
export class PautasController {
  constructor(private readonly service: PautasService) {}

  @Get()
  async list(@Res() response: Response) {
    const results = await this.service.findAdll();
    return response.status(HttpStatus.OK).send(results.map(toRepresentation));
  }

  @Post()
  async save(@Body() pauta: CriarPautaResource, @Res() response: Response) {
    const newPauta: Pauta = toDomain(pauta);
    const result = await this.service.save(newPauta);

    if (result.isError()) {
      return response
        .status(HttpStatus.CONFLICT)
        .send(new ErrorResponse(result.error.message));
    }

    return response
      .status(HttpStatus.CREATED)
      .send(toRepresentation(result.value));
  }

  @Post(':id/sessao')
  async openSession(
    @Param('id') id: string,
    @Body() resource: NewSessionResource,
    @Res() response: Response,
  ) {
    const pauta: Pauta = await this.service.findById(id);

    if (!pauta) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send(new ErrorResponse('Pauta não encontrada.'));
    }

    const sucesso = await this.service.iniciarSessao(pauta, resource.minutes);

    if (sucesso) {
      response.status(HttpStatus.OK).send();
    } else {
      const errorResponse = new ErrorResponse(
        'Não foi possível iniciar a sessão para esta pauta, sua sessão já foi iniciada ou encerrada.',
      );
      return response.status(HttpStatus.CONFLICT).send(errorResponse);
    }
  }
}
