import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { AssociadoService } from './associado.service';
import { Response } from 'express';
import { ErrorResponse } from 'src/common/error.resource';
import { createAssociateResource } from './associado.resource';

@Controller('associado')
export class AssociadoController {
  constructor(private readonly service: AssociadoService) {}

  @Get()
  async list(@Res() response: Response) {
    const results = await this.service.getAll();
    return response.status(HttpStatus.OK).send(results);
  }

  @Get('/:id')
  async getById(@Param('id') id: string, @Res() response: Response) {
    const associate = await this.service.getById(id);
    if (!associate) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send(new ErrorResponse('Associado não encontrado'));
    }
    return response.status(HttpStatus.OK).send(associate);
  }

  @Post()
  async createAssociate(
    @Body() resource: createAssociateResource,
    @Res() response: Response,
  ) {
    const associate = await this.service.obterPorCpf(resource.cpf);

    if (associate) {
      return response
        .status(HttpStatus.CONFLICT)
        .send(new ErrorResponse('Associado já cadastrado.'));
    }

    const result = await this.service.createAssociate(
      resource.cpf,
      resource.name,
    );

    if (result.isError()) {
      return response.status(result.error.status).send(result.error.message);
    }

    return response.status(HttpStatus.OK).send();
  }

  @Put('/:id')
  async updateAssociate(
    @Param('id') id: string,
    @Body() resource: createAssociateResource,
    @Res() response: Response,
  ) {
    const associate = await this.service.getById(id);

    if (!associate) {
      return response
        .status(HttpStatus.NOT_FOUND)
        .send(new ErrorResponse('Associado não encontrado'));
    }
    const cpfAlreadyExists = await this.service.verifyAssociateByCpf(
      resource.cpf,
    );

    if (cpfAlreadyExists) {
      return response
        .status(HttpStatus.CONFLICT)
        .send(new ErrorResponse('Cpf de associado já cadastrado'));
    }

    const newCpf = resource.cpf;
    const newName = resource.name;

    await this.service.updateById(associate.id, newCpf, newName);
    return response.status(HttpStatus.OK).send();
  }
}
