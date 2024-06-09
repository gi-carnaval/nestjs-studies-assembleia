import { IsNotEmpty } from 'class-validator';
import { Pauta } from './pauta.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CriarPautaResource {
  @IsNotEmpty({ message: 'Descrição é uma campo obrigatório' })
  @ApiProperty({
    name: 'descricao',
    example: 'Votação de troca de fechadura do protão',
  })
  descricao: string;
}

export class PautaResource {
  @ApiProperty()
  id: string;
  @ApiProperty()
  descricao: string;
  @ApiProperty()
  status: string;
}

export class NewSessionResource {
  @ApiProperty({ default: 10 })
  minutes: number;
}

export function toRepresentation(entity: Pauta): PautaResource {
  const resource = new PautaResource();
  resource.id = entity.id;
  resource.descricao = entity.descricao;
  resource.status = entity.obterStatus();
  return resource;
}

export function toDomain(resource: CriarPautaResource): Pauta {
  const pauta = new Pauta();
  pauta.descricao = resource.descricao;
  return pauta;
}
