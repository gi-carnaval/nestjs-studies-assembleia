import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { PeopleService } from './people.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('people')
@ApiTags('People')
export class PeopleController {
  constructor(private service: PeopleService) {}

  @Get()
  list(@Res() response: Response) {
    const list = this.service.list();
    return response.status(200).send(list);
  }

  @Get('/:id')
  getById(@Param('id') id: number, @Res() response: Response) {
    const person = this.service.getById(id);
    if (!person) {
      return response.status(404).send();
    }
    return response.status(200).send(person);
  }

  @Post()
  savePerson(@Body() name: { name: string }, @Res() response: Response) {
    this.service.savePerson(name);
    return response.status(201).send('Salvo com Sucesso');
  }

  @Put('/:id')
  updatePerson(
    @Param('id') id: number,
    @Body() name: { name: string },
    @Res() response: Response,
  ) {
    const person = this.service.getById(id);
    if (!person) {
      return response.status(404).send();
    }
    this.service.updatePerson(name, id);
    return response.status(204).send();
  }

  @Delete('/:id')
  deletePerson(@Param('id') id: number, @Res() response: Response) {
    const person = this.service.getById(id);
    if (!person) {
      return response.status(404).send();
    }

    this.service.deletePerson(Number(id));
    return response.status(204).send();
  }
}
