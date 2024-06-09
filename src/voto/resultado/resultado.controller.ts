import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { VotoService } from '../voto.service';
import { Response } from 'express';
import { PautasService } from 'src/pautas/pautas.service';
import { ErrorResponse } from 'src/common/error.resource';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('pautas/:id/resultados')
@ApiTags('Votos')
export class ResultadoController {
  constructor(
    private readonly votoService: VotoService,
    private readonly pautasService: PautasService,
  ) {}

  @Get()
  @ApiOperation({
    description:
      'Rota destinada a listagem dos resultados de uma votação por meio do id da pauta',
  })
  async obterResultado(
    @Param('id') idPauta: string,
    @Res() response: Response,
  ) {
    const pauta = await this.pautasService.findById(idPauta);

    if (!pauta) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send(new ErrorResponse('Pauta não encontrada'));
    }

    const result = await this.votoService.obterResultado(pauta);

    if (result.isError()) {
      result.error.name;

      return response
        .status(result.error.status)
        .send(new ErrorResponse(result.error.message));
    }
    return response.status(HttpStatus.OK).send(result.value);
  }
}
